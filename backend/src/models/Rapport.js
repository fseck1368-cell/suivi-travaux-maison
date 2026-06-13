const mongoose = require('mongoose');

const rapportSchema = new mongoose.Schema({
  projet: { type: mongoose.Schema.Types.ObjectId, ref: 'Projet', required: true },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  travauxRealises: { type: String, required: true },
  difficultes: { type: String },
  meteo: {
    type: String,
    enum: ['ensoleille', 'nuageux', 'pluie', 'vent_fort', 'journee_perdue'],
    default: 'ensoleille'
  },
  photos: [{ type: String }],
  observations: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Rapport', rapportSchema);
