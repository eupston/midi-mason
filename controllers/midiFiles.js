const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const MidiFile = require('../models/MidiFile');


// @desc    Creates and stores
// @route   GET /api/v1/midi/create_midifile
// @access  PUBLIC
exports.createMidiFile = asyncHandler(async (req, res, next) => {

});