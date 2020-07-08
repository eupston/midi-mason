import React from 'react';
import {connect} from "react-redux";
import JukeBox from "../JukeBox/Jukebox";

const MyBeats = (props) => {
    return (
        <div>
            {props.isLoggedIn ?
                <JukeBox filterParams={{limit: 50, author: props.userId }} title={"My Beats"}/>
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
