const mongoose = require('mongoose');

const projetSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  adresse: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFinPrevue: { type: Date, required: true },
  budgetTotal: { type: Number, required: true },
  statut: {
    type: String,
    enum: ['planification', 'en_cours', 'suspendu', 'termine'],
    default: 'planification'
  },
  maitreOuvrage: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  maitreOeuvre: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  avancementGlobal: { type: Number, default: 0, min: 0, max: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Projet', projetSchema);
