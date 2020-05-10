import React from 'react';
import MidiCards from "../../components/Midi/MidiCards/MidiCards";
import {connect} from "react-redux";

const MyBeats = (props) => {
    return (
        <div>
            <MidiCards filterParams={
                {
                    author: props.userId
                }
            }/>
        </div>
    );
};
const mapStateToProps = state => {
    return {
        userId: state.auth.userId
    }
};
export default connect(mapStateToProps)(MyBeats);
