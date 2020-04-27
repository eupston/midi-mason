import React from 'react';
import axios from 'axios';

export const getMidiFiles = async (params) => {
    return (
        axios.get('/api/v1/midi',{params})
            .then(res => {
                return res.data.data;
            })
            .catch(err => console.log(err))
    )
};

export const createMidiFile = async (mididata) => {
    return (
        axios.post('/api/v1/midi', mididata)
            .then(res => {
                return res.data.data;
            })
            .catch(err => console.log(err))
    )
};

