import React, {Component} from 'react';
import MidiCard from "./MidiCard/MidiCard";
import MidiQuery from "../../../utils/MidiQuery";
import classes from './midicards.module.css';

class MidiCards extends Component {
    state = {
        midiFiles: [],
    }

    async componentDidMount() {
        const data = await MidiQuery();
        if(data){
            this.setState({midiFiles:data})
        }
    }

    render() {
        const midiFileElements = this.state.midiFiles.map(midifile => {
            return <MidiCard
                    key={midifile._id}
                    name={midifile.name}
                    tempo={midifile.tempo}
                    length={midifile.length}
                    sequence={midifile.midi_sequence}

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