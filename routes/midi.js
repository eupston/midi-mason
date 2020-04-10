var express = require('express');
var router = express.Router();
var midiController = require('../controllers/midi');

router.post('/generate_drum_rnn', midiController.generateMidiDrums);

module.exports = router;
