const Depense = require('../models/Depense');
const Projet = require('../models/Projet');

exports.createDepense = async (req, res) => {
  try {
    const depense = await Depense.create(req.body);
    res.status(201).json(depense);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.getDepensesByProjet = async (req, res) => {
  try {
    const { categorie, dateDebut, dateFin } = req.query;
    let filter = { projet: req.params.projetId };

    if (categorie) filter.categorie = categorie;
    if (dateDebut || dateFin) {
      filter.date = {};
      if (dateDebut) filter.date.$gte = new Date(dateDebut);
      if (dateFin) filter.date.$lte = new Date(dateFin);
    }

    const depenses = await Depense.find(filter)
      .populate('phase', 'titre')
      .sort('-date');

    const total = depenses.reduce((sum, d) => sum + d.montant, 0);
    const projet = await Projet.findById(req.params.projetId);

    res.json({
      depenses,
      resume: {
        total,
        budget: projet.budgetTotal,
        restant: projet.budgetTotal - total,
        depassement: total > projet.budgetTotal
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.deleteDepense = async (req, res) => {
  try {
    const depense = await Depense.findByIdAndDelete(req.params.id);
    if (!depense) {
      return res.status(404).json({ message: 'Dépense non trouvée.' });
    }
    res.json({ message: 'Dépense supprimée.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};
