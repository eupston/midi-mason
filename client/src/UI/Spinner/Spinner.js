import React from 'react';
import "./spinner.css";

const Spinner = (props) => {
    return (
        <div className="spinner">
            <div className="loader"/>
            <h5>{props.text}</h5>
        </div>
    );
};

export default Spinner;
