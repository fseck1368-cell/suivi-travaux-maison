const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createDepense, getDepensesByProjet, deleteDepense
} = require('../controllers/depenseController');

router.use(auth);

router.post('/', authorize('maitre-oeuvre', 'maitre-ouvrage'), upload.single('facture'), createDepense);
router.get('/projet/:projetId', getDepensesByProjet);
router.delete('/:id', authorize('maitre-ouvrage'), deleteDepense);

module.exports = router;
