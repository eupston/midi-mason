import * as actionTypes from '../actions/actionTypes'

const initialState = {
    bpm: 120,
    totalSteps: 8,
    pattern: [],
    url: "",
    isDownloadable: false,
    isUpdateable: false,
    sequence_title: "",
    midiId: "",
    authorName: "",

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
                isUpdateable: action.midiData.isUpdateable,
                sequence_title: action.midiData.sequence_title,
                midiId: action.midiData.midiId,
                authorName: action.midiData.authorName,
            };
        default:
            return {...state};
    }
};

export default reducer;