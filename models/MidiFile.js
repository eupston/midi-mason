const mongoose = require("mongoose");

const MidiFile = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot be longer than 50 characters']
    },
    type: {
        type: String,
        enum: [
            'drum',
            'melody'
        ],
        default: 'drum'
    },
    url:{
        type: String,
        required: [true, 'Please an S3 Link to the Midi File'],
        unique: true
    },
    tempo:{
        type: Number,
        min: 30,
        max: 999,
        default: 120,
        required: [true, 'Please provide a tempo'],
    },
    length: {
        type: Number,
        required: true
    },
    author: {
        type: String,//TODO make this into USER type
        required: [true, 'Please provide a Author'],
    },
    genre: {
        type: String,
        required: [true, 'Please provide a Genre'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    midi_sequence:{
        type: String,
    },
    comments: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("MidiFile", MidiFile);