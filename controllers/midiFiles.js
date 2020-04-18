const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const MidiFile = require('../models/MidiFile');
const User = require('../models/User');
const {PythonShell} = require('python-shell')
const S3Upload = require("../utils/S3");
const {deleteFile} = require('../utils/files');
var path = require('path');

// @desc    Gets all midi files available
// @route   GET /api/v1/midi/
// @access  PUBLIC
exports.getMidiFiles = asyncHandler(async (req, res, next) => {

    const reqQuery = { ...req.query };
    const removeFields = ['limit', 'page'];
    removeFields.forEach(p => delete reqQuery[p]);

    let queryStr = JSON.stringify(reqQuery);
    // https://docs.mongodb.com/manual/reference/operator/query/gt/
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => {
        return `$${match}`;
    });
    queryStr = JSON.parse(queryStr)

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await MidiFile.countDocuments();
    const totalFound = await MidiFile.countDocuments(queryStr);
    const totalPages = Math.ceil(totalFound / limit);

    let midifiles = await MidiFile.find(queryStr).skip(startIndex).limit(limit);
    const pagination = {};

    if(endIndex < totalFound){
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(201)
        .json({
            success: true,
            totalFound: totalFound,
            total: total,
            totalPages:totalPages,
            pagination,
            data: midifiles
        });
});


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