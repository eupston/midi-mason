var express = require('express');
var router = express.Router();
var midiController = require('../controllers/midiFiles');
const {isAuth}= require('../middleware/auth');

router.get('/', midiController.getMidiFiles);

router.post('/generate_drum_rnn', isAuth, midiController.generateDrumRNN);

router.post('/uploadmidifile', isAuth, midiController.uploadMidiFile);


module.exports = router;
