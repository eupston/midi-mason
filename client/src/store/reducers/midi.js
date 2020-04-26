import * as actionTypes from '../actions/actionTypes'

const initialState = {
    bpm: 120,
    totalSteps: 8,
    pattern: [],
};

const reducer = (state= initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_MIDI_SEQUENCER_DATA:
            return {
                ...state,
                bpm: action.midiData.bpm,
                totalSteps: action.midiData.totalSteps,
                pattern: action.midiData.pattern
            };
        default:
            return {...state};
    }
};

export default reducer;