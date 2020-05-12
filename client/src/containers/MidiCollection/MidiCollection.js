import React, {Component} from 'react';
import SliderGlide from "../../UI/SlideGlide/SlideGlide";
import {getMidiFiles} from "../../utils/MidiQueries";
import MidiCard from "../../components/Midi/MidiCards/MidiCard/MidiCard";


const carouselOptions = { type: "slide", perView: 1, startAt: 0, focusAt: 'center'};

class MidiCollection extends Component {
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
            />
        })
        return (
            <div>
                <SliderGlide options={carouselOptions}>
                    {midiFileElements}
                </SliderGlide>
            </div>
        );
    }
}

export default MidiCollection;