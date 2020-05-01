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


export const deleteMidiFile = async (id, userId) => {
    return (
        axios.delete('/api/v1/midi/'+ id + "?userId=" + userId)
            .then(res => {
                return res.data.data;
            })
            .catch(err => console.log(err))
    )
};

