const mongoose = require('mongoose');

const tacheSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  phase: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', required: true },
  projet: { type: mongoose.Schema.Types.ObjectId, ref: 'Projet', required: true },
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  avancement: { type: Number, default: 0, min: 0, max: 100 },
  dateDebut: { type: Date },
  dateFin: { type: Date },
  priorite: {
    type: String,
    enum: ['basse', 'moyenne', 'haute'],
    default: 'moyenne'
  },
  statut: {
    type: String,
    enum: ['a_faire', 'en_cours', 'terminee'],
    default: 'a_faire'
  },
  dependances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tache' }]
}, { timestamps: true });

module.exports = mongoose.model('Tache', tacheSchema);
