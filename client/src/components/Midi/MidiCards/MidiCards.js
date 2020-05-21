import React, {Component} from 'react';
import MidiCard from "./MidiCard/MidiCard";
import {getMidiFiles} from "../../../utils/MidiQueries";
import classes from './midicards.module.css';
import Spinner from "../../../UI/Spinner/Spinner";

class MidiCards extends Component {
    state = {
        midiFiles: [],
    }

    async componentDidMount() {
        const data = await getMidiFiles(this.props.filterParams);
        if(data){
            this.setState({midiFiles:data})
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
                    authorId = {midifile.author}
                    sequence={midifile.midi_sequence}
                    url={midifile.url}
                />
        })
        return (
            <div className={classes.MidiCards}>
                {!midiFileElements.length < 1 ? midiFileElements : <Spinner/>}
            </div>
        );
    }
}


export default MidiCards;