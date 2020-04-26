import * as actionTypes from '../actions/actionTypes';

export const setMidiSequencerData = (midiData) => {
    return {
        type:actionTypes.SET_MIDI_SEQUENCER_DATA,
        midiData: midiData
    };
};
