import React from 'react';
import './collectionheader.scss'

const CollectionHeader = (props) => {
    return (
        <div className='CollectionHeader'>
            <h1 data-heading={props.title}/>
        </div>
    );
};

export default CollectionHeader;