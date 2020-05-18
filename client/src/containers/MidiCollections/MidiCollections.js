import React from 'react';
import MidiCollection from "../MidiCollection/MidiCollection";
import JukeBox from "../JukeBox/Jukebox";

const MidiCollections = () => {
    return (
        <React.Fragment >
            {/*<MidiCollection title={"All Beats"} filterParams={{limit: 50}}/>*/}
            <JukeBox filterParams={{limit: 50}} title={"All Beats"}/>
            <JukeBox filterParams={{limit: 50}} title={"Electro"}/>
        </React.Fragment>
    );
};

export default MidiCollections;
