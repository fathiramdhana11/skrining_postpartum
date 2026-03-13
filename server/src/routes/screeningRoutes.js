const express = require('express');
const router = express.Router();
const screeningController = require('../controllers/screeningController');

router.post('/', screeningController.submitScreening);
router.get('/', screeningController.getAllScreenings);
router.get('/history/:userId', screeningController.getHistory);
router.delete('/:id', screeningController.deleteScreening);
router.put('/:id/notes', screeningController.updateNotes);

module.exports = router;
