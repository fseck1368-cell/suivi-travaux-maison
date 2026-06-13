require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const socketHandler = require('./sockets/socketHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

connectDB();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/projets', require('./routes/projets'));
app.use('/api/v1/phases', require('./routes/phases'));
app.use('/api/v1/taches', require('./routes/taches'));
app.use('/api/v1/depenses', require('./routes/depenses'));
app.use('/api/v1/rapports', require('./routes/rapports'));

app.get('/api/v1/messages/:projetId', async (req, res) => {
  const Message = require('./models/Message');
  try {
    const messages = await Message.find({ projet: req.params.projetId })
      .populate('expediteur', 'nom prenom role')
      .sort('createdAt')
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

app.get('/api/v1/users/artisans', async (req, res) => {
  const User = require('./models/User');
  try {
    const artisans = await User.find({ role: 'artisan' }).select('-password');
    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
