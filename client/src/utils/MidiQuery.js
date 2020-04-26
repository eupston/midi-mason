import React from 'react';
import axios from 'axios';

const MidiQuery = async () => {
    return (
        axios.get('/api/v1/midi')
            .then(res => {
                return res.data.data;
            })
            .catch(err => console.log(err))
    )
};
export default MidiQuery;
