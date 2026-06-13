const mongoose = require('mongoose');

const depenseSchema = new mongoose.Schema({
  projet: { type: mongoose.Schema.Types.ObjectId, ref: 'Projet', required: true },
  phase: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase' },
  titre: { type: String, required: true },
  montant: { type: Number, required: true, min: 0 },
  categorie: {
    type: String,
    enum: ['materiaux', 'main_oeuvre', 'equipement', 'transport', 'autre'],
    required: true
  },
  date: { type: Date, default: Date.now },
  description: { type: String },
  facture: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Depense', depenseSchema);
