import React from 'react';
import MidiCollection from "../MidiCollection/MidiCollection";

const MidiCollections = () => {
    return (
        <React.Fragment >
            <MidiCollection title={"All Beats"} filterParams={{limit: 50}}/>
            <MidiCollection title={"Recently Made"} filterParams={{limit: 50}}/>
            <MidiCollection title={"Electro"} filterParams={{limit: 50}}/>
        </React.Fragment>
    );
};

export default MidiCollections;
