const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
let {PythonShell} = require('python-shell')


// @desc    Generates Midi drums
// @route   GET /api/v1/midi/generate_drum_rnn
// @access  PUBLIC
exports.generateMidiDrums = asyncHandler(async (req, res, next) => {
    let options = {
        mode: 'text',
        pythonPath: "./midi_generation/venv/bin/python",
        scriptPath: "./midi_generation",
        args:['--num_steps', '32', "--primer_drums", "[]"]
    };
    PythonShell.run('drum_generator.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        res.status(201)
            .json({
                success: true,
                data: results
            });
    });



});