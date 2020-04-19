var express = require('express');
var router = express.Router();
var midiController = require('../controllers/midiFiles');
const {isAuth}= require('../middleware/auth');

router.get('/', midiController.getMidiFiles);

router.get('/:id', midiController.getMidiFile);

router.put('/:id', midiController.updateMidiFile);

router.delete('/:id', midiController.deleteUser);

router.post('/generate_drum_rnn', isAuth, midiController.generateDrumRNN);

router.post('/uploadmidifile', isAuth, midiController.uploadMidiFile);


module.exports = router;
