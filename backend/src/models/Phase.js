const mongoose = require('mongoose');

const phaseSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  projet: { type: mongoose.Schema.Types.ObjectId, ref: 'Projet', required: true },
  ordre: { type: Number, required: true },
  dateDebut: { type: Date },
  dateFin: { type: Date },
  budgetPrevu: { type: Number, default: 0 },
  statut: {
    type: String,
    enum: ['a_faire', 'en_cours', 'terminee'],
    default: 'a_faire'
  },
  avancement: { type: Number, default: 0, min: 0, max: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Phase', phaseSchema);
