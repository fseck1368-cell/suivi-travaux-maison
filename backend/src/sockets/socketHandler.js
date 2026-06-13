const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

module.exports = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Utilisateur connecté: ${socket.user.prenom} ${socket.user.nom}`);

    socket.on('join-projet', (projetId) => {
      socket.join(`projet-${projetId}`);
      console.log(`${socket.user.prenom} a rejoint projet-${projetId}`);
    });

    socket.on('leave-projet', (projetId) => {
      socket.leave(`projet-${projetId}`);
    });

    socket.on('avancement', (data) => {
      socket.to(`projet-${data.projetId}`).emit('avancement', {
        tacheId: data.tacheId,
        avancement: data.avancement,
        artisan: `${socket.user.prenom} ${socket.user.nom}`,
        timestamp: new Date()
      });
    });

    socket.on('tache-terminee', (data) => {
      socket.to(`projet-${data.projetId}`).emit('tache-terminee', {
        tacheId: data.tacheId,
        titre: data.titre,
        artisan: `${socket.user.prenom} ${socket.user.nom}`,
        timestamp: new Date()
      });
    });

    socket.on('message', async (data) => {
      try {
        const message = await Message.create({
          projet: data.projetId,
          expediteur: socket.user._id,
          contenu: data.contenu
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('expediteur', 'nom prenom role');

        io.to(`projet-${data.projetId}`).emit('message', populatedMessage);
      } catch (error) {
        socket.emit('error', { message: 'Erreur envoi message' });
      }
    });

    socket.on('typing', (data) => {
      socket.to(`projet-${data.projetId}`).emit('typing', {
        user: `${socket.user.prenom} ${socket.user.nom}`
      });
    });

    socket.on('disconnect', () => {
      console.log(`Utilisateur déconnecté: ${socket.user.prenom} ${socket.user.nom}`);
    });
  });
};
