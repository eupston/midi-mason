var express = require('express');
var router = express.Router();
var midiController = require('../controllers/midiFiles');
const {isAuth}= require('../middleware/auth');

router.post('/generate_drum_rnn', isAuth, midiController.generateDrumRNN);

module.exports = router;
