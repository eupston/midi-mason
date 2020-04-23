import React, { Component } from 'react';
import Tone from 'tone';
import Grid from '../Grid/grid';

class DrumSequencer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bpm: 70,
            volume: -6,
            start: false,
            totalSteps: 8,
            totalTracks: 4,
            pattern: []
        };

        Tone.Transport.bpm.value = this.state.bpm;
        Tone.Master.volume.value = this.state.volume;

        this.player = new Tone.Players(
            {
                BD: "./audio/kick.wav",
                CP: "./audio/clap.wav",
                OH: "./audio/hh_open.wav",
                CH: "./audio/hh_closed.wav"
            }).toMaster()
    }

    componentDidMount(){
        const pattern = Array(this.state.totalTracks)
            .fill(new Array(this.state.totalSteps)
                .fill({ triggered: false, activated: false }));
        this.setState({pattern:pattern})
    }
    //TODO change step count while playing
    startSequencer = () => {
        const steps = Array(this.state.totalSteps).fill(1).map((v, i) => {
            return i;
        });
        const drumOrder = ['BD', 'CP', 'OH', 'CH'];

        this.drumSeq = new Tone.Sequence((time, step) => {
            const patternCopy = JSON.parse(JSON.stringify(this.state.pattern));
            patternCopy.map((track, i) => {
                const activated = track[step]['activated'];
                if(step === 0){
                    patternCopy[i][track.length - 1] = {
                        triggered: false,
                        activated: patternCopy[i][track.length - 1]['activated']
                    }
                }
                else{
                    patternCopy[i][step - 1] = {
                        triggered: false,
                        activated:  patternCopy[i][step - 1]['activated']
                    }
                }
                patternCopy[i][step] = { triggered: true, activated: activated}

                if (activated) {
                    this.player.get(drumOrder[i]).start()
                }
                this.setState({pattern: patternCopy});
            })

        }, steps, "16n");
        this.drumSeq.loop = true;
        this.drumSeq.start()
    }

    clearTriggers = () => {
        const patternCopy = JSON.parse(JSON.stringify(this.state.pattern));
        const patternUpdated = patternCopy.map(track => {
            return track.map(step => {
                const updatedStep = {triggered:false, activated: step['activated']}
                return updatedStep
            })
        })
        this.setState({pattern: patternUpdated});
    }

    toggleStep = (line, step) => {
        const patternCopy = JSON.parse(JSON.stringify(this.state.pattern));
        const { triggered, activated } = patternCopy[line][step];
        patternCopy[line][step] = { triggered, activated: !activated };
        this.setState({pattern: patternCopy});
    };

    handleStartStop = () => {
        this.setState({start:!this.state.start})
        if(!this.state.start) {
            this.startSequencer()
            Tone.Transport.start("+0.2")
        }
        else{
            Tone.Transport.stop()
            this.drumSeq.stop()
            this.clearTriggers()
        }
    }

    handleStepCountChange = (e) => {
        const patternCopy = JSON.parse(JSON.stringify(this.state.pattern));
        const new_steps = parseInt(e.target.value);
        const current_steps = patternCopy[0].length;
        const patternUpdated = patternCopy.map(track => {
            const trackCopy = JSON.parse(JSON.stringify(track));
            if(new_steps < current_steps){
                trackCopy.pop()
            }
            else{
                trackCopy.push({ triggered: false, activated:false })
            }
            return trackCopy
        })
        console.log(patternUpdated)
        this.setState({totalSteps: new_steps, pattern: patternUpdated});
    }

    render() {
        return (
            <div>
                <p>Drum Sequencer</p>
                <button onClick={this.handleStartStop}>Start</button>
                <input type="number" value={this.state.totalSteps} onChange={this.handleStepCountChange}/>
                <Grid
                    sequence={this.state.pattern}
                    toggleStep={this.toggleStep}
                    totalTracks={this.state.totalTracks}
                    totalSteps={this.state.totalSteps}
                />
            </div>
        );
    }
}


export default DrumSequencer;