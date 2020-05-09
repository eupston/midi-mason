import classes from './midicard.module.css';
import {convertMidiSequenceToPattern} from "../../../../utils/MidiUtils";
import {Link, Redirect} from "react-router-dom";
import * as midiActions from '../../../../store/actions';
import React, {Component} from 'react';
import {connect} from "react-redux";

class MidiCard extends Component {
    state = {
        id: this.props.id,
        name: this.props.name,
        tempo: this.props.tempo,
        length: this.props.length,
        author: this.props.author,
        seq: this.props.sequence,
        pattern: [],
    }

    handlePlayDrumSequencer = () => {
        const pattern = convertMidiSequenceToPattern(this.state.seq, this.state.length);
        const midiData = {
            bpm : this.state.tempo,
            totalSteps: this.state.length,
            pattern: pattern
        }
        this.props.setMidiSequencerData(midiData);
    }


    render() {
        return (
            <div className={classes.MidiCard} >
                <p>Name: {this.state.name}</p>
                <p>Tempo: {this.state.tempo}</p>
                <p>Length: {this.state.length}</p>
                <Link onClick={this.handlePlayDrumSequencer} to={'/sequencer'} ><button type="button" >Play</button></Link>
                <button type="button" onClick={() => this.props.onDelete(this.state.id, this.props.userId)}>Delete</button>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMidiSequencerData: (midiData) => dispatch(midiActions.setMidiSequencerData(midiData))
    }
};
const mapStateToProps = state => {
    return {
        userId: state.auth.userId
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(MidiCard);
