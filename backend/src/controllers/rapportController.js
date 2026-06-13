const Rapport = require('../models/Rapport');

exports.createRapport = async (req, res) => {
  try {
    const photos = req.files ? req.files.map(f => f.filename) : [];
    const rapport = await Rapport.create({
      ...req.body,
      auteur: req.user._id,
      photos
    });
    res.status(201).json(rapport);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.getRapportsByProjet = async (req, res) => {
  try {
    const rapports = await Rapport.find({ projet: req.params.projetId })
      .populate('auteur', 'nom prenom role')
      .sort('-date');
    res.json(rapports);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.deleteRapport = async (req, res) => {
  try {
    const rapport = await Rapport.findByIdAndDelete(req.params.id);
    if (!rapport) {
      return res.status(404).json({ message: 'Rapport non trouvé.' });
    }
    res.json({ message: 'Rapport supprimé.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};
