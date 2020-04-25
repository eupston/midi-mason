import React, { Component } from 'react';
import Tone from 'tone';
import Grid from '../Grid/grid';
import classes from './drumseqencer.module.css';

class DrumSequencer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bpm: 120,
            volume: -6,
            totalSteps: 16,
            totalTracks: 8,
            start: false,
            pattern: [],
            drumOrder :['BD', 'CP', 'OH', 'CH']
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
    componentDidUpdate(prevProps, prevState){
        const patternHasChanged = prevState.totalSteps !== this.state.totalSteps;
        if(patternHasChanged) {
            Tone.Transport.cancel()
            this.clearTriggers()
            this.startSequencer()
        }
    }

    startSequencer = () => {
        const steps = new Array(this.state.totalSteps).fill(1).map((v, i) => {
            return i;
        });
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
                    this.player.get(this.state.drumOrder[i]).start()
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

    handleToggleStep = (line, step) => {
        const patternCopy = JSON.parse(JSON.stringify(this.state.pattern));
        const { triggered, activated } = patternCopy[line][step];
        patternCopy[line][step] = { triggered, activated: !activated };
        this.setState({pattern: patternCopy});
    };

    handleHoverOnStep = (line, step) => {
        const patternCopy = JSON.parse(JSON.stringify(this.state.pattern));
        const { triggered, activated } = patternCopy[line][step];
        patternCopy[line][step] = { triggered, activated, hovered: true};
        this.setState({pattern: patternCopy});
    };

    handleHoverOffStep = (line, step) => {
        const patternCopy = JSON.parse(JSON.stringify(this.state.pattern));
        const { triggered, activated } = patternCopy[line][step];
        patternCopy[line][step] = { triggered, activated, hovered: false};
        this.setState({pattern: patternCopy});
    };

    handleStartStop = () => {
        this.setState({start:!this.state.start})
        if(!this.state.start) {
            this.startSequencer()
            Tone.Transport.start()
        }
        else{
            Tone.Transport.stop()
            Tone.Transport.clear()
            this.drumSeq.stop()
            this.clearTriggers()
        }
    }

    handleStepCountChange = (e) => {
        const patternCopy = JSON.parse(JSON.stringify(this.state.pattern));
        const new_steps = parseInt(e.target.value);
        console.log(new_steps)
        if(new_steps < 1 || new_steps > 64 ){
            return false
        }
        else if (isNaN(new_steps)){
            this.setState({totalSteps: 1});
            return false
        }

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
        this.setState({totalSteps: new_steps, pattern: patternUpdated});
    }

    handleTempoChange = (e) => {
        const new_bpm = parseInt(e.target.value);

        if(new_bpm < 20 || new_bpm > 300 ){
            return
        }
        Tone.Transport.bpm.value = new_bpm;
        this.setState({bpm: new_bpm});
    }

    render() {
        return (
            <div className={classes.DrumSequencer}>
                <div className={classes.Transport}>
                    <div className={classes.TransportItem}>
                        <span>dummy</span>
                        <button type="button" onClick={this.handleStartStop}>{!this.state.start ? "Play" : "Stop"}</button>
                    </div>
                    <div className={classes.TransportItem}>
                        <label>Total Steps</label>
                        <input type="number" value={this.state.totalSteps} onChange={this.handleStepCountChange}/>
                    </div>
                    <div className={classes.TransportItem}>
                        <label>BPM</label>
                        <input type="number" value={this.state.bpm} onChange={this.handleTempoChange}/>
                    </div>
                </div>
                <Grid
                    sequence={this.state.pattern}
                    toggleStep={this.handleToggleStep}
                    hoverStep={this.handleHoverOnStep}
                    hoverOffStep={this.handleHoverOffStep}
                    totalTracks={this.state.totalTracks}
                    totalSteps={this.state.totalSteps}
                />
            </div>
        );
    }
}


export default DrumSequencer;