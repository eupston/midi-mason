const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../Utils/errorResponse');
const {PythonShell} = require('python-shell')
const MidiFile = require('../models/MidiFile');

// @desc    Generates Midi drums
// @route   GET /api/v1/generate_midi/generate_drum_rnn
// @access  PUBLIC
exports.generateMidiDrums = asyncHandler(async (req, res, next) => {
    let options = {
        mode: 'text',
        args:['--num_steps', req.body.num_steps, "--primer_drums", req.body.primer_drums]
    };
    PythonShell.run('midi_generation/drum_generator.py', options, async function(err, results) {
        if (err) {
            console.log(err)
            return next(new ErrorResponse("Something Went Wrong Generating Midi File", 500));
        }
        const S3_URL = results[0];
        const midiinfo = {
            name: req.body.name,
            type:  "drum",
            url: S3_URL,
            tempo: req.body.tempo,
            length: req.body.num_steps,
            author: "eugene",
            genre: req.body.genre,
            rating: req.body.rating,
            midi_sequence: req.body.primer_drums,
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