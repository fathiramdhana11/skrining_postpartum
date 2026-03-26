const express = require('express');
const router = express.Router();
const screeningController = require('../controllers/screeningController');

const auth = require('../middleware/authMiddleware');

router.post('/', auth, screeningController.submitScreening);
router.get('/', auth, screeningController.getAllScreenings);
router.get('/history/:userId', auth, screeningController.getHistory);
router.delete('/:id', auth, screeningController.deleteScreening);
router.put('/:id/notes', auth, screeningController.updateNotes);

module.exports = router;
