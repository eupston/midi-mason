var express = require('express');
var router = express.Router();
var midiController = require('../controllers/midiFiles');
const {isAuth}= require('../middleware/auth');

router.get('/', midiController.getMidiFiles);

router.post('/', midiController.createMidiFile);

router.get('/fields/:field', midiController.getUniqueFieldValues);

router.get('/:id', midiController.getMidiFile);

router.put('/:id', midiController.updateMidiFile);

router.delete('/:id', midiController.deleteMidiFile);

router.post('/generate_drum_rnn', midiController.generateDrumRNN);

router.post('/uploadmidifile', midiController.uploadMidiFile);

module.exports = router;
