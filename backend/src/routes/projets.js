const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createProjet, getProjets, getProjet, updateProjet, getDashboard
} = require('../controllers/projetController');

router.use(auth);

router.get('/dashboard', getDashboard);
router.post('/', authorize('maitre-ouvrage', 'maitre-oeuvre'), createProjet);
router.get('/', getProjets);
router.get('/:id', getProjet);
router.put('/:id', authorize('maitre-ouvrage', 'maitre-oeuvre'), updateProjet);

module.exports = router;
