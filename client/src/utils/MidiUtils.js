export const convertMidiSequenceToPattern = (midiSeq, totalSteps) => {
    const totalTracks = 8;
    const trackMidiMapping = { 36:0, 37:1, 38:2, 39:3, 40:4, 42:5, 46:6, 49:7 }
    const emptyPattern = Array(totalTracks)
        .fill(new Array(totalSteps)
            .fill({ triggered: false, activated: false }));
    const pattern = JSON.parse(JSON.stringify(emptyPattern));

    midiSeq.map(item => {
        const currentStep = item['quantized_start_step'];
        const currentPitch = item['pitch'];
        const currentTrack = trackMidiMapping[currentPitch];
        pattern[currentTrack][currentStep]['activated'] = true;
    })
    return pattern;
};

export const convertPatternToMidiSequence = (pattern) => {
    const trackMidiMapping = { 0:36, 1:37, 2:38, 3:39, 4:40, 5:42, 6:46, 7:49 }
    const midi_sequence = [];
    pattern.map((track, track_num) => {
         track.map((step, step_num) => {
            const midi_info_step = {}
            if(step['activated']){
                midi_info_step['pitch'] = trackMidiMapping[track_num]
                midi_info_step['velocity'] = 100
                midi_info_step['quantized_start_step'] = step_num
                midi_sequence.push(midi_info_step)
            }
        })
    })
    return midi_sequence;
};






