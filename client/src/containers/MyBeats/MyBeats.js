import React from 'react';
import MidiCards from "../../components/Midi/MidiCards/MidiCards";
import {connect} from "react-redux";
import classes from './mybeats.modules.css';

const MyBeats = (props) => {
    return (
        <div className={classes.MyBeats}>
            {props.isLoggedIn ?
                <MidiCards filterParams={
                    {
                        author: props.userId
                    }
                }/>
                :
                <h1>Please Login to View Your Beats.</h1>
            }
        </div>
    );
};
const mapStateToProps = state => {
    return {
        userId: state.auth.userId,
        isLoggedIn: state.auth.isLoggedIn
    }
};
export default connect(mapStateToProps)(MyBeats);
