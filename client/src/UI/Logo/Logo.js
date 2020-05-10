import React from 'react';
import classes from './logo.module.css';
import midiMasonLogo from "../../assets/images/midi_mason_logo_white.png";

const Logo = (props) => {
    return (
        <div className={classes.Logo} style={{"fontSize":props.size +"em"}}>
            <img src={midiMasonLogo} width={50} height={50}/>
            <h4>Midi Mason</h4>
        </div>
    );
};

export default Logo;
