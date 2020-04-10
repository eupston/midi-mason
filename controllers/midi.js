const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../Utils/errorResponse');
const {PythonShell} = require('python-shell')
var AWS = require('aws-sdk');

// @desc    Generates Midi drums
// @route   GET /api/v1/midi/generate_drum_rnn
// @access  PUBLIC
exports.generateMidiDrums = asyncHandler(async (req, res, next) => {
    let options = {
        mode: 'text',
        scriptPath: "./midi_generation",
        args:['--num_steps', req.body.num_steps, "--primer_drums", req.body.primer_drums]
    };
    PythonShell.run('drum_generator.py', options, function (err, results) {
        if (err) {
            console.log(err)
            return next(new ErrorResponse("Something Went Wrong on the Server", 500));
        }
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        res.status(201)
            .json({
                success: true,
                data: {"s3_url": results}
            });
    });
});