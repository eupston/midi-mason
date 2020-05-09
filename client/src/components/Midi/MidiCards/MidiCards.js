import React, {Component} from 'react';
import MidiCard from "./MidiCard/MidiCard";
import {deleteMidiFile, getMidiFiles} from "../../../utils/MidiQueries";
import classes from './midicards.module.css';

class MidiCards extends Component {
    state = {
        midiFiles: [],
    }

    async componentDidMount() {
        const params = {
            limit: 50
        };

        const data = await getMidiFiles(params);
        if(data){
            this.setState({midiFiles:data})
        }
    }

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
        const midiFileElements = this.state.midiFiles.map(midifile => {
            return <MidiCard
                    key={midifile._id}
                    id={midifile._id}
                    name={midifile.name}
                    tempo={midifile.tempo}
                    length={midifile.length}
                    sequence={midifile.midi_sequence}
                    onDelete={this.handleDeletePattern}
                />
        })
        return (
            <div className={classes.MidiCards}>
                {midiFileElements}
            </div>
        );
    }
}


export default MidiCards;