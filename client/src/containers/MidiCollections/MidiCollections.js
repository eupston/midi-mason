import React, {useState, useEffect} from 'react';
import JukeBox from "../JukeBox/Jukebox";
import {getUniqueMidiFileFieldValues} from "../../utils/MidiQueries";

const MidiCollections = () => {
    const [genres, setGenres] = useState([]);
     useEffect( () => {
         async function getAllGenres() {
             const all_genres = await getUniqueMidiFileFieldValues("genre");
             setGenres(all_genres);
         }
         getAllGenres();
     }, []);
    const genreElements = genres.map(genre => {
        return <JukeBox filterParams={{limit: 50, genre: genre}} title={genre}/>
    });
    return (
        <React.Fragment >
            <JukeBox filterParams={{limit: 50}} title={"All Beats"}/>
            {genreElements}
        </React.Fragment>
    );
};

export default MidiCollections;
