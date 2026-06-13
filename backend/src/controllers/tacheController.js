const Tache = require('../models/Tache');
const Phase = require('../models/Phase');
const Projet = require('../models/Projet');

exports.createTache = async (req, res) => {
  try {
    const tache = await Tache.create(req.body);
    res.status(201).json(tache);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.getTachesByProjet = async (req, res) => {
  try {
    let filter = { projet: req.params.projetId };
    if (req.user.role === 'artisan') {
      filter.artisan = req.user._id;
    }
    const taches = await Tache.find(filter)
      .populate('artisan', 'nom prenom specialite')
      .populate('phase', 'titre');
    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.updateTache = async (req, res) => {
  try {
    const tache = await Tache.findById(req.params.id);
    if (!tache) {
      return res.status(404).json({ message: 'Tâche non trouvée.' });
    }

    if (req.user.role === 'artisan' && tache.artisan.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres tâches.' });
    }

    Object.assign(tache, req.body);
    if (tache.avancement === 100) {
      tache.statut = 'terminee';
    } else if (tache.avancement > 0) {
      tache.statut = 'en_cours';
    }
    await tache.save();

    await recalculerAvancement(tache.phase, tache.projet);

    res.json(tache);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

async function recalculerAvancement(phaseId, projetId) {
  const tachesPhase = await Tache.find({ phase: phaseId });
  if (tachesPhase.length > 0) {
    const avgPhase = Math.round(
      tachesPhase.reduce((sum, t) => sum + t.avancement, 0) / tachesPhase.length
    );
    await Phase.findByIdAndUpdate(phaseId, { avancement: avgPhase });
  }

  const tachesProjet = await Tache.find({ projet: projetId });
  if (tachesProjet.length > 0) {
    const avgProjet = Math.round(
      tachesProjet.reduce((sum, t) => sum + t.avancement, 0) / tachesProjet.length
    );
    await Projet.findByIdAndUpdate(projetId, { avancementGlobal: avgProjet });
  }
}

exports.deleteTache = async (req, res) => {
  try {
    const tache = await Tache.findByIdAndDelete(req.params.id);
    if (!tache) {
      return res.status(404).json({ message: 'Tâche non trouvée.' });
    }
    await recalculerAvancement(tache.phase, tache.projet);
    res.json({ message: 'Tâche supprimée.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};
