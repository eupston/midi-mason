//TODO look into midimapping bug
export const convertMidiSequenceToPattern = (midiSeq, totalSteps) => {
    const totalTracks = 10;
    const trackMidiMapping = { 36:0, 37:1, 38:2, 39:3, 42:4, 45:5, 46:6, 48:7, 49:8, 50:9 }
    const emptyPattern = Array(totalTracks)
        .fill(new Array(totalSteps)
            .fill({ triggered: false, activated: false }));
    const pattern = JSON.parse(JSON.stringify(emptyPattern));
    console.log(midiSeq);
    midiSeq.map(item => {
        const currentStep = item['quantized_start_step'];
        const currentPitch = item['pitch'];
        const currentTrack = trackMidiMapping[currentPitch];
        console.log(item)
        pattern[currentTrack][currentStep]['activated'] = true;
    })
    return pattern;
};

export const convertPatternToMidiSequence = (pattern) => {
    const trackMidiMapping = { 0:36, 1:37, 2:38, 3:39, 4:42, 5:45, 6:46, 7:48, 8:49, 9:50 }
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

export const convertPatternToPrimerSequence = (pattern) => {
    const trackMidiMapping = { 0:36, 1:37, 2:38, 3:39, 4:42, 5:45, 6:46, 7:48, 8:49, 9:50 }
    const empty_primer_sequence = Array(pattern[0].length).fill([]);
    const primer_sequence = JSON.parse(JSON.stringify(empty_primer_sequence));
    pattern.map((track, track_num) => {
        track.map((step, step_num) => {
            if(step['activated']){
                const pitch = trackMidiMapping[track_num]
                primer_sequence[step_num].push(pitch);
            }
        })
    })
    const primer_sequence_str = JSON.stringify(primer_sequence)
        .replace(/\[/g,"\(")
        .replace(/\]/g,"\)")
        .replace(/^\(/,"\[")
        .replace(/\)$/,"\]")
        .replace(/\(([0-9][0-9])\)/g, "($1,)")
    return primer_sequence_str;
};




