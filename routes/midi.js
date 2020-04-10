var express = require('express');
var router = express.Router();
var midiController = require('../controllers/midi');

router.get('/generate_drum_rnn', midiController.generateMidiDrums);

module.exports = router;
