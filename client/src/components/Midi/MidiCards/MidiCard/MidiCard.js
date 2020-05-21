import './midicard.css';
import {convertMidiSequenceToPattern} from "../../../../utils/MidiUtils";
import {Link} from "react-router-dom";
import * as midiActions from '../../../../store/actions';
import React, {Component} from 'react';
import {connect} from "react-redux";
import Radium, {StyleRoot} from 'radium';
import { fadeIn } from 'react-animations';
import {deleteMidiFile} from "../../../../utils/MidiQueries";
import PushButton from "../../../../UI/PushButton/PushButton";

const styles = {
    fadeIn: {
        animation: 'x 1s',
        animationName: Radium.keyframes(fadeIn, 'fadeIn')
    }
}

class MidiCard extends Component {
    state = {
        id: this.props.id,
        name: this.props.name,
        tempo: this.props.tempo,
        length: this.props.length,
        authorId: this.props.authorId,
        seq: this.props.sequence,
        url: this.props.url,
        pattern: [],
    }

    handlePlayDrumSequencer = () => {
        const pattern = convertMidiSequenceToPattern(this.state.seq, this.state.length);
        const midiData = {
            bpm : this.state.tempo,
            totalSteps: this.state.length,
            pattern: pattern,
            url: this.state.url
        }
        this.props.setMidiSequencerData(midiData);
    }

    //TODO delete handler has bug
    handleDeletePattern = async (id, userId) => {
        const response = await deleteMidiFile(id, userId);
        if(response){
            const midiFilesCopy = [...this.state.midiFiles];
            const midiFilesUpdated = midiFilesCopy.filter(midifile =>{
                return midifile._id.toString() !== id;
            })
            this.setState({midiFiles:midiFilesUpdated})
        }
        else{
            alert("Could Not Delete Midi File. Please Try Again.")
        }
    }

    render() {
        return (
                <div className="MidiCard"  style={styles.fadeIn}>
                    <h4>{this.state.name}</h4>
                    <div className="DescriptionItem">
                        <h5>Tempo: </h5>
                        <p> {this.state.tempo}</p>
                    </div>
                    <div className="DescriptionItem">
                        <h5>Length: </h5>
                        <p> {this.state.length}</p>
                    </div>
                    <div className="DescriptionItem">
                        <h5>Author: </h5>
                        <p> Steve</p>
                    </div>
                   <Link onClick={this.handlePlayDrumSequencer} to={'/sequencer'} ><PushButton/></Link>
                    {this.props.userId === this.state.authorId ?
                        <button type="button" onClick={() => this.handleDeletePattern(this.state.id, this.props.userId)}>Delete</button>
                        :
                        null
                    }
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
