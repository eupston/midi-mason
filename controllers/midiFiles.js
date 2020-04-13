const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const MidiFile = require('../models/MidiFile');
const User = require('../models/User');
const {PythonShell} = require('python-shell')

// @desc    Creates and stores
// @route   GET /api/v1/midi/create_midifile
// @access  PUBLIC
exports.createMidiFile = asyncHandler(async (req, res, next) => {

});


// @desc    Generates Midi drums
// @route   GET /api/v1/midi/generate_drum_rnn
// @access  PUBLIC
exports.generateDrumRNN = asyncHandler(async (req, res, next) => {


    const user = await User.findById(req.body.userId);
    if(!user){
        return next(new ErrorResponse("Could not Find User Id: " + req.body.userId, 404));
    }
    let options = {
        mode: 'text',
        args:['--num_steps', req.body.num_steps, "--primer_drums", req.body.primer_drums, "--username", user.name ]
    };
    PythonShell.run('midi_generation/drum_generator.py', options, async function(err, results) {
        if (err) {
            console.log(err)
            return next(new ErrorResponse("Something Went Wrong Generating Midi File", 500));
        }
        const S3_URL = results[0];
        const midi_sequence = results[1];
        const midiinfo = {
            name: req.body.name,
            type:  "drum",
            url: S3_URL,
            tempo: req.body.tempo,
            length: req.body.num_steps,
            author: user,
            genre: req.body.genre,
            rating: req.body.rating,
            midi_sequence: midi_sequence,
            comments: req.body.comments
        }
        MidiFile.create(midiinfo)
            .then(midifile => {
                res.status(201)
                    .json({
                        success: true,
                        data: midifile
                    });
            })
            .catch(err => {
                console.log(err)
                return next(new ErrorResponse(err, 500));
            });
    });
});