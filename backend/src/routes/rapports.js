const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createRapport, getRapportsByProjet, deleteRapport
} = require('../controllers/rapportController');

router.use(auth);

router.post('/', authorize('maitre-ouvrage', 'maitre-oeuvre', 'artisan'), upload.array('photos', 5), createRapport);
router.get('/projet/:projetId', getRapportsByProjet);
router.delete('/:id', authorize('maitre-oeuvre'), deleteRapport);

module.exports = router;
