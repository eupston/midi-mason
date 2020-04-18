const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const MidiFile = require('../models/MidiFile');
const User = require('../models/User');
const {PythonShell} = require('python-shell')
const S3Upload = require("../utils/S3");
const {deleteFile} = require('../utils/files');
var path = require('path');



// @desc    Adds an existing midi file to the DB
// @route   POST /api/v1/midi/uploadmidifile
// @access  PUBLIC
exports.uploadMidiFile = asyncHandler(async (req, res, next) => {
    //TODO create function to clean up database entry, S3 entry, and server files if error occurs
    const user = await User.findById(req.body.userId);
    if(!user){
        return next(new ErrorResponse("Could not Find User Id: " + req.body.userId, 404));
    }

    filepath = req.file.path;
    filename = path.join("midi", req.body.userId, req.file.originalname);

    let options = {
        mode: 'text',
        args:['--extract_midi_data', "True", "--midi_file", filepath ]
    };

    PythonShell.run('midi_generation/midi_utils.py', options, async function(err, results) {
        if (err) {
            deleteFile(filepath);
            return next(new ErrorResponse(err, 500));
        }
        const S3_URL = await S3Upload(filename, filepath);

        const midiinfo = {
            name: req.body.name,
            type:  "drum",
            url: S3_URL.Location,
            tempo: results[1],
            length: results[2],
            author: user,
            genre: req.body.genre,
            rating: req.body.rating,
            midi_sequence: results[0],
            comments: req.body.comments
        }

        try {
            const midifile = await MidiFile.create(midiinfo)
            user.midifiles.push(midifile);
            await user.save();
            deleteFile(filepath);
            res.status(201)
                .json({
                    success: true,
                    data: midifile
                });
        }
        catch (err){
            deleteFile(filepath);
            console.log(err)
            return next(new ErrorResponse(err, 500));
        }
    });
});


// @desc    Generates Midi drums
// @route   POST /api/v1/midi/generate_drum_rnn
// @access  PUBLIC
exports.generateDrumRNN = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.body.userId);
    if(!user){
        return next(new ErrorResponse("Could not Find User Id: " + req.body.userId, 404));
    }
    let options = {
        mode: 'text',
        args:['--num_steps', req.body.num_steps, "--primer_drums", req.body.primer_drums, "--userId", user._id ]
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