import './midicard.css';
import {convertMidiSequenceToPattern} from "../../../../utils/MidiUtils";
import {Link} from "react-router-dom";
import * as midiActions from '../../../../store/actions';
import React, {Component} from 'react';
import {connect} from "react-redux";
import Radium, {StyleRoot} from 'radium';
import { fadeIn } from 'react-animations';
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
        authorName: this.props.authorName,
        seq: this.props.sequence,
        url: this.props.url,
        genre: this.props.genre,
        pattern: [],
    }

    handlePlayDrumSequencer = () => {
        const isUpdateable = this.props.userId === this.state.authorId;
        const pattern = convertMidiSequenceToPattern(this.state.seq, this.state.length);
        const midiData = {
            bpm: this.state.tempo,
            totalSteps: this.state.length,
            pattern: pattern,
            url: this.state.url,
            isDownloadable: true,
            isUpdateable: isUpdateable,
            sequence_title: this.state.name,
            midiId: this.props.id,
            authorName: this.state.authorName,

        }
        this.props.setMidiSequencerData(midiData);
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
                        <p> {this.state.authorName}</p>
                    </div>
                    <div className="DescriptionItem">
                        <h5>Genre: </h5>
                        <p> {this.state.genre}</p>
                    </div>
                   <Link onClick={this.handlePlayDrumSequencer} to={'/sequencer'} ><PushButton/></Link>
                    {this.props.userId === this.state.authorId ?
                        <button className="DeleteButton" type="button" onClick={() => this.props.onDelete(this.state.id, this.props.userId)}>
                            <i className="fa fa-trash fa-1x" aria-hidden="true"></i>
                        </button>
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
