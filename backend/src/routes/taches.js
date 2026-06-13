const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createTache, getTachesByProjet, updateTache, deleteTache
} = require('../controllers/tacheController');

router.use(auth);

router.post('/', authorize('maitre-oeuvre', 'maitre-ouvrage'), createTache);
router.get('/projet/:projetId', getTachesByProjet);
router.put('/:id', updateTache);
router.delete('/:id', authorize('maitre-oeuvre', 'maitre-ouvrage'), deleteTache);

module.exports = router;
