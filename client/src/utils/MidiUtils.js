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
