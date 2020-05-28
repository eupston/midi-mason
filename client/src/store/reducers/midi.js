import * as actionTypes from '../actions/actionTypes'

const initialState = {
    bpm: 120,
    totalSteps: 8,
    pattern: [],
    url: "",
    isDownloadable: false,
    sequence_title: ""
};

const reducer = (state= initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_MIDI_SEQUENCER_DATA:
            return {
                ...state,
                bpm: action.midiData.bpm,
                totalSteps: action.midiData.totalSteps,
                pattern: action.midiData.pattern,
                url: action.midiData.url,
                isDownloadable: action.midiData.isDownloadable,
                sequence_title: action.midiData.sequence_title
            };
        default:
            return {...state};
    }
};

export default reducer;