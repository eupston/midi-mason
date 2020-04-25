export const convertMidiSequenceToPattern = (midiSeq, totalSteps) => {
    const totalTracks = 8;
    const trackMidiMapping = { 36:0, 37:1, 38:2, 39:3, 40:4, 41:5, 42:6, 43:7 }
    const pattern = Array(totalTracks)
        .fill(new Array(totalSteps)
            .fill({ triggered: false, activated: false }));

    midiSeq.map(item => {
        const currentStep = item['quantized_start_step'];
        const currentPitch = item['pitch'];
        pattern[trackMidiMapping[currentPitch]][currentStep] = { triggered: false, activated: true };
    })
    return pattern;
};

