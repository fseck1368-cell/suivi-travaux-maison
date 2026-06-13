const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createPhase, getPhasesByProjet, updatePhase, deletePhase
} = require('../controllers/phaseController');

router.use(auth);

router.post('/', authorize('maitre-oeuvre', 'maitre-ouvrage'), createPhase);
router.get('/projet/:projetId', getPhasesByProjet);
router.put('/:id', authorize('maitre-oeuvre', 'maitre-ouvrage'), updatePhase);
router.delete('/:id', authorize('maitre-oeuvre', 'maitre-ouvrage'), deletePhase);

module.exports = router;
