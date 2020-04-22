import React, { Component } from 'react';
import Tone from 'tone';
import Grid from '../../../examples/grid';


const initialCellState = { triggered: false, activated: false };

class DrumSequencer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bpm: 50,
            volume: -6,
            start: false,
            pattern: [
                new Array(8).fill(initialCellState),
                new Array(8).fill(initialCellState),
                new Array(8).fill(initialCellState),
                new Array(8).fill(initialCellState)
            ]
        };

        Tone.Transport.bpm.value = this.state.bpm;
        Tone.Master.volume.value = this.state.volume;

    }

    componentDidUpdate() {
        const steps = Array(8).fill(1).map((v, i) => {
            return i;
        });
        const drumOrder = ['BD', 'CP', 'OH', 'CH'];
        const player = new Tone.Players(
            {
                BD: "./audio/kick.wav",
                CP: "./audio/clap.wav",
                OH: "./audio/hh_open.wav",
                CH: "./audio/hh_closed.wav"
            }).toMaster()
        const pattern = [[0,1],[],[1],[],[0],[0],[0,1],[0]];
        const patternCopy = [...this.state.pattern];

        this.seq = new Tone.Sequence((time, step) => {
            let current_track_idx = null;
            console.log(step)
            patternCopy.map((track, i) => {
                const { triggered, activated } = track[step];
                current_track_idx = i;
                patternCopy[i][step] = { triggered: true, activated }
                // if(step == 0){
                //     // const { activated } = track[steps.length - 1];
                //     patternCopy[i][7] = { triggered: false }
                // }
                //
                // else{
                //     patternCopy[i][step - 1] = { triggered: false }
                // }

                // if (triggered && activated) {
                    // player.get(drumOrder[i]).start()

                // }
            })

            Tone.Draw.schedule(() => {
                // this.setState({pattern: patternCopy});
            }, time)

        }, steps, "16n");

        Tone.Buffer.on('load', () => {
            this.seq.start()
            this.seq.loop = true;
        })

    }

    toggleStep = (line, step) => {
        const patternCopy = [...this.state.pattern];
        const { triggered, activated } = patternCopy[line][step];
        patternCopy[line][step] = { triggered, activated: !activated };
        console.log("toggled");
        this.setState({pattern: patternCopy});
    };

    handleStartStop = () => {
        this.setState({start:!this.state.start})
        if(!this.state.start) {
            // this.seq.start()

            Tone.Transport.start("+0.2")
        }
        else{
            console.log("stop")
            Tone.Transport.stop()
            // this.seq.stop()
        }
    }

    render() {
        return (
            <div>
                <p>Drum Sequencer</p>
                <button onClick={this.handleStartStop}>Start</button>
                <Grid sequence={this.state.pattern} toggleStep={this.toggleStep} />
            </div>
        );
    }
}


export default DrumSequencer;