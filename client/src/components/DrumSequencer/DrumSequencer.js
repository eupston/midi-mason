import React, { Component } from 'react';
import Tone from 'tone';
import Grid from './Grid/grid';
import classes from './drumseqencer.module.css';
import {connect} from 'react-redux';
import {createMidiFile, generateDrumRNN, updateMidiFile} from "../../utils/MidiQueries";
import {
    convertMidiSequenceToPattern,
    convertPatternToMidiSequence,
    convertPatternToPrimerSequence
} from "../../utils/MidiUtils";
import Modal from "../../UI/Modal/Modal";
import SaveForm from "../../UI/SaveForm/SaveForm";
import Spinner from "../../UI/Spinner/Spinner";
import * as midiActions from "../../store/actions";
import NumberInput from "../../UI/NumberInput/NumberInput";

class DrumSequencer extends Component {
    state = {
        bpm: this.props.bpm,
        volume: -6,
        totalSteps: this.props.totalSteps,
        totalTracks: 9,
        startSeq: false,
        pattern: this.props.pattern,
        drumOrder : ['BD', 'S1', 'HC', 'OH', "TL", "TM", "TH", "S2", "RD"],
        showSaveModal:false,
        showGeneratingModal: false,
        showDownloadModal: false,
        showUpdateModal: false,
        isSaving: false,
        isGenerating: false,
        isUpdating: false,
        maxSteps: 64,
        generateDisabled:false,
        isDownloadable: this.props.isDownloadable,
        sequence_title: this.props.sequence_title,
        authorName: this.props.authorName
    };

    constructor(props) {
        super(props);
        Tone.Transport.bpm.value = this.state.bpm;
        Tone.Master.volume.value = this.state.volume;

        this.player = new Tone.Players(
            {
                BD: "./audio/kit_1/kick.wav",
                S1: "./audio/kit_1/snare1.wav",
                HC: "./audio/kit_1/hh_closed.wav",
                OH: "./audio/kit_1/hh_open.wav",
                TL: "./audio/kit_1/tom_low.wav",
                TM: "./audio/kit_1/tom_mid.wav",
                TH: "./audio/kit_1/tom_hi.wav",
                S2: "./audio/kit_1/snare2.wav",
                RD: "./audio/kit_1/ride.wav",
            }).toMaster()
    }

    componentWillMount(){

        if(this.state.pattern.length < 1) {
            const pattern = Array(this.state.totalTracks)
                .fill(new Array(this.state.totalSteps)
                    .fill({triggered: false, activated: false}));
            this.setState({pattern: pattern})
        }
    }
    componentDidUpdate(prevProps, prevState){
        const patternHasChanged = prevState.totalSteps !== this.state.totalSteps;
        if(patternHasChanged) {
            Tone.Transport.cancel()
            this.clearTriggers()
            this.startSequencer()
        }
        if (prevProps !== this.props) {
            this.setState({
                bpm : this.props.bpm,
                totalSteps: this.props.totalSteps,
                pattern: this.props.pattern,
                url: this.props.url,
                isDownloadable: true
            })
        }
    }

    componentWillUnmount() {
        if(this.state.startSeq){
            this.handleStartStop();
        }
        const midi_data = {
            bpm: this.state.bpm,
            totalSteps: this.state.totalSteps,
            pattern: this.state.pattern,
            url: this.props.url,
            sequence_title: this.state.sequence_title,
            isDownloadable: this.state.isDownloadable,
            isUpdateable: this.props.isUpdateable,
            midiId: this.props.midiId,
            authorName : this.state.authorName
        }
        this.props.setMidiSequencerData(midi_data);
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
            })
            this.setState({pattern: patternCopy});

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

    clearSteps = () => {
        const patternCopy = JSON.parse(JSON.stringify(this.state.pattern));
        const patternUpdated = patternCopy.map(track => {
            return track.map(step => {
                const updatedStep = {triggered:false, activated: false}
                return updatedStep
            })
        })
        this.setState({pattern: patternUpdated, isDownloadable:false, sequence_title:"", authorName:""});
    }

    handleToggleStep = (line, step) => {
        const patternCopy = JSON.parse(JSON.stringify(this.state.pattern));
        const { triggered, activated } = patternCopy[line][step];
        patternCopy[line][step] = { triggered, activated: !activated };
        this.setState({pattern: patternCopy, isDownloadable:false});
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
        this.setState({startSeq:!this.state.startSeq})

        if(!this.state.startSeq) {
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

        let disableGenerateButton = false;
        if(this.state.totalSteps + 3 > this.state.maxSteps) {
            disableGenerateButton = true;
        }
        this.setState({
            totalSteps: new_steps,
            pattern: patternUpdated,
            generateDisabled:disableGenerateButton,
            isDownloadable: false
        });
    }

    handleTempoChange = (e) => {
        const new_bpm = parseInt(e.target.value);

        if(new_bpm < 20 || new_bpm > 200 ){
            return
        }
        Tone.Transport.bpm.value = new_bpm;
        this.setState({bpm: new_bpm, isDownloadable: false});
    }

    handleSaveModalShow = () => {
        this.setState({showSaveModal:true});
    };

    handleSaveModalHide = () => {
        this.setState({showSaveModal:false});
    };

    handleDownloadModalShow = () => {
        if(!this.state.isDownloadable){
            this.setState({showDownloadModal:true});
        }
    };

    handleDownloadModalHide = () => {
        this.setState({showDownloadModal:false});
    };


    handleGeneratingModalShow = () => {
        this.setState({showGeneratingModal:true});
    };

    handleGeneratingModalHide = () => {
        this.setState({showGeneratingModal:false});
    };

    handleUpdateModalShow = async () => {
        this.setState({showUpdateModal:true});

        if(this.props.isUpdateable){
            this.setState({isUpdating:true});
            const midi_sequence = convertPatternToMidiSequence(this.state.pattern);

            const request_body = {
                "userId": this.props.userId,
                "midi_sequence": midi_sequence,
                "length": this.state.totalSteps,
                "tempo": this.state.bpm,
            }

            const data = await updateMidiFile(this.props.midiId, request_body);
            if(data){
                const pattern = convertMidiSequenceToPattern(data.midi_sequence, data.length);
                const midiData = {
                    bpm : data.tempo,
                    totalSteps: data.length,
                    pattern: pattern,
                    url: data.url,
                    isDownloadable: true,
                    isUpdateable: true,
                    sequence_title: this.state.sequence_title,
                    midiId: this.props.midiId,
                    authorName : this.state.authorName
                }
                this.props.setMidiSequencerData(midiData);
            }
            this.handleUpdateModalHide();
            this.setState({isUpdating:false});
        }
    }

    handleUpdateModalHide = () => {
        this.setState({showUpdateModal:false});
    }

    handleSavePattern = async (e, formData) => {
        e.preventDefault();
        Tone.Transport.stop()
        Tone.Transport.clear()
        this.setState({isSaving:true});
        const midi_sequence = convertPatternToMidiSequence(this.state.pattern);

        const request_body = {
            "userId": this.props.userId,
            "midi_sequence": midi_sequence,
            "length": this.state.totalSteps,
            "tempo": this.state.bpm,
            "genre": formData.genre,
            "rating": 5,
            "name": formData.name
        }
        const data = await createMidiFile(request_body);
        if(data){
            const pattern = convertMidiSequenceToPattern(data.midi_sequence, data.length);
            const midiData = {
                bpm : data.tempo,
                totalSteps: data.length,
                pattern: pattern,
                url: data.url,
                isDownloadable: true,
                isUpdateable: true,
                sequence_title: formData.name,
                midiId: this.props.midiId,
                authorName : data.author_name
            }
            this.props.setMidiSequencerData(midiData);
        }
        this.handleSaveModalHide();
        this.setState({isSaving:false, sequence_title: formData.name, authorName: data.author_name });
    }

    handleAIDrumGeneration = async (e, formData) => {
        e.preventDefault();
        Tone.Transport.stop()
        Tone.Transport.clear()
        this.setState({isGenerating:true});
        const primer_sequence_str = convertPatternToPrimerSequence(this.state.pattern);
        const request_body = {
            "userId": this.props.userId,
            "primer_drums": primer_sequence_str,
            "length": formData.generatedSteps,
            "tempo": this.state.bpm,
            "genre": formData.genre,
            "rating": 5,
            "name": formData.name
        }
        const data = await generateDrumRNN(request_body);
        if(data){
            const pattern = convertMidiSequenceToPattern(data.midi_sequence, data.length);
            const midiData = {
                bpm : data.tempo,
                totalSteps: data.length,
                pattern: pattern,
                url: data.url,
                isDownloadable: true,
                isUpdateable: true,
                sequence_title: formData.name,
                midiId: this.props.midiId,
                authorName : data.author_name
            }
            this.props.setMidiSequencerData(midiData);
        }
        this.handleGeneratingModalHide();
        this.setState({isGenerating:false, sequence_title: formData.name, authorName: data.author_name});
    }

    render() {
        return (
            <div className={classes.DrumSequencer}>
                <h2>{this.state.sequence_title}</h2>
                <h6>{this.state.authorName ? "By " + this.state.authorName : null}</h6>
                <div className={classes.Transport}>
                    <div className={classes.TransportItem}>
                        <span>dummy</span>
                        <button type="button" onClick={this.handleStartStop}>{!this.state.startSeq ? "Play" : "Stop"}</button>
                    </div>
                    <div className={classes.TransportItemInput}>
                        <label>Total Steps</label>
                        <NumberInput id={"totalSteps"} value={this.state.totalSteps} onChangeHandler={this.handleStepCountChange} />
                    </div>
                    <div className={classes.TransportItemInput}>
                        <label>BPM</label>
                        <NumberInput id={"bpm"} value={this.state.bpm} onChangeHandler={this.handleTempoChange} />
                    </div>
                    <div className={classes.TransportItem}>
                        <span>dummy</span>
                        <button type="button" onClick={this.handleGeneratingModalShow} disabled={this.state.generateDisabled}>Generate</button>
                    </div>
                    <div className={classes.TransportItem}>
                        <span>dummy</span>
                        <button type="button" onClick={this.handleSaveModalShow}>Save</button>
                    </div>
                    <div className={classes.TransportItem}>
                        <span>dummy</span>
                        <button type="button" onClick={this.handleUpdateModalShow}>Update</button>
                    </div>
                    <div className={classes.TransportItem}>
                        <span>dummy</span>
                        <a href={this.state.isDownloadable ? this.props.url : null} target="_blank" download>
                            <button type="button" onClick={this.handleDownloadModalShow}>Download</button>
                        </a>
                    </div>
                    <div className={classes.TransportItem}>
                        <span>dummy</span>
                        <button type="button" onClick={this.clearSteps}>Clear</button>
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
                <Modal
                    show={this.state.showSaveModal}
                    onHide={this.handleSaveModalHide}
                    title="Save New Beat" {...this.props}>
                    {this.props.isLoggedIn ?
                        !this.state.isSaving ?
                        <SaveForm
                            onSavePattern={this.handleSavePattern}
                            button_text={"Save Beat"}/>
                        :
                        <Spinner text={"Saving..."}/>
                    :
                    <h1 style={{color:"white"}}>Please Login to Save a Beat.</h1>
                    }
                </Modal>
                <Modal
                    show={this.state.showUpdateModal}
                    onHide={this.handleUpdateModalHide}
                    title="Update Beat" {...this.props}>
                    {this.props.isLoggedIn ?
                        this.state.isUpdating ?
                            <Spinner text={"Updating Beat..."}/>
                            :
                            <h1 style={{color:"white"}}>Please Save the Beat Before Updating.</h1>
                        :
                        <h1 style={{color:"white"}}>Please Login to Update a Beat.</h1>
                    }
                </Modal>
                <Modal
                    show={this.state.showGeneratingModal}
                    onHide={this.handleGeneratingModalHide}
                    title="Generate AI Beat" {...this.props}>
                    {this.props.isLoggedIn ?
                        !this.state.isGenerating ?
                        <SaveForm
                            onSavePattern={this.handleAIDrumGeneration}
                            button_text={"Generate AI Beat"}
                            totalsteps={true}
                            min={this.state.totalSteps + 3}
                            max={this.state.maxSteps}
                        />
                        :
                        <Spinner text={"Generating AI Beat..."} />
                    :
                        <h1 style={{color:"white"}}>Please Login to Generate AI Midi Drums.</h1>
                    }
                </Modal>
                <Modal
                    show={this.state.showDownloadModal}
                    onHide={this.handleDownloadModalHide}
                    title="Download Beat" {...this.props}>
                    <h1 style={{color:"white"}}>Please Save or Update the Beat to Download it.</h1>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        midiId: state.midi.midiId,
        authorName: state.midi.authorName,
        bpm: state.midi.bpm,
        totalSteps: state.midi.totalSteps,
        pattern: state.midi.pattern,
        isDownloadable: state.midi.isDownloadable,
        isUpdateable: state.midi.isUpdateable,
        url: state.midi.url,
        sequence_title: state.midi.sequence_title,
        userId: state.auth.userId,
        isLoggedIn: state.auth.isLoggedIn
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setMidiSequencerData: (midiData) => dispatch(midiActions.setMidiSequencerData(midiData))
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(DrumSequencer);