const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  projet: { type: mongoose.Schema.Types.ObjectId, ref: 'Projet', required: true },
  expediteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contenu: { type: String, required: true },
  lu: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
