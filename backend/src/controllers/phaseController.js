const Phase = require('../models/Phase');
const Tache = require('../models/Tache');

exports.createPhase = async (req, res) => {
  try {
    const phase = await Phase.create(req.body);
    res.status(201).json(phase);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.getPhasesByProjet = async (req, res) => {
  try {
    const phases = await Phase.find({ projet: req.params.projetId }).sort('ordre');
    res.json(phases);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.updatePhase = async (req, res) => {
  try {
    const phase = await Phase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!phase) {
      return res.status(404).json({ message: 'Phase non trouvée.' });
    }
    res.json(phase);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.deletePhase = async (req, res) => {
  try {
    const phase = await Phase.findByIdAndDelete(req.params.id);
    if (!phase) {
      return res.status(404).json({ message: 'Phase non trouvée.' });
    }
    await Tache.deleteMany({ phase: phase._id });
    res.json({ message: 'Phase supprimée.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};
