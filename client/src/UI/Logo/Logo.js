import React from 'react';
import classes from './logo.module.css';

const Logo = (props) => {
    return (
        <div className={classes.Logo} style={{"fontSize":props.size +"em"}}>
            <h4>Midi Mason</h4>
        </div>
    );
};

export default Logo;
