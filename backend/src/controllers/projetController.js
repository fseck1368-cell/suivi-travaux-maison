const Projet = require('../models/Projet');
const Phase = require('../models/Phase');
const Tache = require('../models/Tache');
const Depense = require('../models/Depense');

exports.createProjet = async (req, res) => {
  try {
    const projet = await Projet.create({
      ...req.body,
      maitreOuvrage: req.user._id
    });
    res.status(201).json(projet);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.getProjets = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'maitre-ouvrage') {
      filter.maitreOuvrage = req.user._id;
    } else if (req.user.role === 'maitre-oeuvre') {
      filter.maitreOeuvre = req.user._id;
    } else if (req.user.role === 'artisan') {
      const taches = await Tache.find({ artisan: req.user._id }).distinct('projet');
      filter._id = { $in: taches };
    }

    const projets = await Projet.find(filter)
      .populate('maitreOuvrage', 'nom prenom')
      .populate('maitreOeuvre', 'nom prenom')
      .sort('-createdAt');

    res.json(projets);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.getProjet = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id)
      .populate('maitreOuvrage', 'nom prenom email')
      .populate('maitreOeuvre', 'nom prenom email');

    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé.' });
    }

    const phases = await Phase.find({ projet: projet._id }).sort('ordre');
    const taches = await Tache.find({ projet: projet._id })
      .populate('artisan', 'nom prenom specialite');
    const depenses = await Depense.find({ projet: projet._id });

    const totalDepenses = depenses.reduce((sum, d) => sum + d.montant, 0);

    res.json({
      ...projet.toObject(),
      phases,
      taches,
      budget: {
        total: projet.budgetTotal,
        depense: totalDepenses,
        restant: projet.budgetTotal - totalDepenses
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.updateProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé.' });
    }
    res.json(projet);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'maitre-ouvrage') {
      filter.maitreOuvrage = req.user._id;
    } else if (req.user.role === 'maitre-oeuvre') {
      filter.maitreOeuvre = req.user._id;
    }

    const projets = await Projet.find(filter);
    const projetIds = projets.map(p => p._id);

    const totalProjets = projets.length;
    const projetsEnCours = projets.filter(p => p.statut === 'en_cours').length;
    const projetsTermines = projets.filter(p => p.statut === 'termine').length;

    const depenses = await Depense.find({ projet: { $in: projetIds } });
    const totalDepenses = depenses.reduce((sum, d) => sum + d.montant, 0);
    const totalBudget = projets.reduce((sum, p) => sum + p.budgetTotal, 0);

    const taches = await Tache.find({ projet: { $in: projetIds } });
    const tachesTerminees = taches.filter(t => t.statut === 'terminee').length;

    res.json({
      totalProjets,
      projetsEnCours,
      projetsTermines,
      totalBudget,
      totalDepenses,
      budgetRestant: totalBudget - totalDepenses,
      totalTaches: taches.length,
      tachesTerminees,
      avancementMoyen: projets.length > 0
        ? Math.round(projets.reduce((sum, p) => sum + p.avancementGlobal, 0) / projets.length)
        : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};
