const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const MidiFile = require('../models/MidiFile');
const User = require('../models/User');
const {PythonShell} = require('python-shell')
const S3Upload = require("../utils/S3");
const {deleteFile} = require('../utils/files');
var path = require('path');
const fs = require('fs');



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
        args:['--num_steps', req.body.length, "--primer_drums", req.body.primer_drums, "--userId", user._id ]
    };
    PythonShell.run('midi_generation/drum_generator.py', options, async function(err, results) {
        if (err) {
            console.log(err)
            return next(new ErrorResponse("Something Went Wrong Generating Midi File", 500));
        }
        const S3_URL = results[0];
        const midi_sequence = JSON.parse(results[1].replace(/\'/g,"\""));
        const midiinfo = {
            name: req.body.name,
            type:  "drum",
            url: S3_URL,
            tempo: req.body.tempo,
            length: req.body.length,
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



// @desc    Adds a midi file
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
            console.log(err)
            return next(new ErrorResponse(err, 500));
        }
        const S3_URL = await S3Upload(filename, filepath);
        const midi_sequence = JSON.parse(results[0].replace(/\'/g,"\""));

        const midiinfo = {
            name: req.body.name,
            type:  "drum",
            url: S3_URL.Location,
            tempo: results[1],
            length: results[2],
            author: user,
            genre: req.body.genre,
            rating: req.body.rating,
            midi_sequence: midi_sequence,
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
            console.log(err)
            return next(new ErrorResponse(err, 500));
        }
    });
});

// @desc    Creates a midi file
// @route   POST /api/v1/midi
// @access  PUBLIC
exports.createMidiFile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.body.userId);
    if(!user){
        return next(new ErrorResponse("Could not Find User Id: " + req.body.userId, 404));
    }
    let options = {
        mode: 'text',
        args:[
            '--note_sequence_to_midi_file', "True",
            "--note_sequence", JSON.stringify(req.body.midi_sequence),
            "--tempo", req.body.tempo,
            "--length", req.body.length,
            '--output_path', "midi_generation/output"
        ]
    };

    PythonShell.run('midi_generation/midi_utils.py', options, async function(err, results) {
        if (err) {
            console.log(err)
            return next(new ErrorResponse(err, 500));
        }

        const filepath =  results[0];
        const file_content = fs.readFileSync(filepath);
        const filename = path.join("midi", req.body.userId, path.basename(filepath));

        const S3_URL = await S3Upload(filename, file_content);
        const midiinfo = {
            name: req.body.name,
            type:  "drum",
            url: S3_URL.Location,
            tempo: req.body.tempo,
            length: req.body.length,
            author: user,
            genre: req.body.genre,
            rating: req.body.rating,
            midi_sequence: req.body.midi_sequence,
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
            console.log(err)
            return next(new ErrorResponse(err, 500));
        }
    })
});


// @desc    Gets midi files available
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

// @desc    Get Midifile by id
// @route   GET /api/v1/midi/:id
// @access  PUBLIC
exports.getMidiFile = asyncHandler(async (req, res, next) => {

    const midifile = await MidiFile.findById(req.params.id);

    if (!midifile){
        return next(new ErrorResponse(`Midifile not found in id of ${req.params.id}`,404));
    }

    res
        .status(200)
        .json({
            success: true,
            data: midifile
        });
});


// @desc    Update a midi file
// @route   PUT /api/v1/midi/:id
// @access  PUBLIC
exports.updateMidiFile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.body.userId);
    if(!user){
        return next(new ErrorResponse("Could not Find User Id: " + req.body.userId, 404));
    }
    const midifilefound = await MidiFile.findById(req.params.id);
    if (!midifilefound){
        return next(new ErrorResponse(`MidiFile not found in id of ${req.params.id}`, 404));
    }

    if(user.midifiles.includes(req.params.id)){
        const midifile = await MidiFile.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!midifile){
            return next(new ErrorResponse(`MidiFile not found in id of ${req.params.id}`, 404));
        }

        res
            .status(200)
            .json({
                success: true,
                data: midifile
            });
    }
    else{
        return next(new ErrorResponse("Not Authorized to Update this Midifile " + req.params.id, 403));
    }
});


// @desc    Delete a midifile
// @route   DELETE /api/v1/midi/:id
// @access  PRIVATE
exports.deleteMidiFile = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.query.userId); // get from session
    if(!user){
        return next(new ErrorResponse("Could not Find User Id: " + req.query.userId, 404));
    }

    const midifilefound = await MidiFile.findById(req.params.id);
    if (!midifilefound){
        return next(new ErrorResponse(`MidiFile not found in id of ${req.params.id}`, 404));
    }

    if(user.midifiles.includes(req.params.id)){
        const midifile = await MidiFile.findByIdAndDelete(req.params.id);

        if (!midifile){
            return next(new ErrorResponse(`MidiFile not found in id of ${req.params.id}`, 404));
        }

        user.midifiles.pull(req.params.id);
        await user.save();

        res
            .status(200)
            .json({
                success: true,
                data: midifile
            });
    }
    else{
        return next(new ErrorResponse("Not Authorized to Delete this Midifile " + req.params.id, 403));
    }


});