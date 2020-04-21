import React, { Component } from 'react';
import Tone from 'tone';

class DrumMachine extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bpm: 40,
            volume: -6,
        };
        this.sampleOrder = ['BD', 'CP', 'OH', 'CH'];

        const player = new Tone.Players(
            {
                BD: "./audio/kick.wav",
                CP: "./audio/clap.wav",
                OH: "./audio/hh_open.wav",
                CH: "./audio/hh_closed.wav"
            }).toMaster()
        const steps = Array(32).fill(1).map((v, i) => {
            return i;
        });
        var seq = new Tone.Sequence(function(time, note){
            console.log(note);
            player.get(note).start()
        }, steps, "16n");

        Tone.Buffer.on('load', () => {
            seq.start();
            seq.loop = true;
        })

        Tone.Transport.start("+0.2")
        Tone.Transport.bpm.value = this.state.bpm;
        Tone.Master.volume.value = this.state.volume;
    }

    render() {
        return (
            <div>
                <p>Drum Machine</p>
            </div>
        );
    }
}


export default DrumMachine;