import React, {Component} from 'react';
import "./jukebox.scss";
import {getMidiFiles} from "../../utils/MidiQueries";
import MidiCard from "../../components/Midi/MidiCards/MidiCard/MidiCard";
import CollectionHeader from "../../UI/CollectionHeader/CollectionHeader";

var THRESHOLD = 0.6,
    MAX_SPEED = 5,
    LEFT = 'left',
    RIGHT = 'right',
    scrolling,
    pageX,
    screenWidth;


function enableGalleryScroll(){
    var gallery = document.getElementById('gallery');

    gallery.onmouseover = function(event) {
        pageX = event.clientX || event.screenX;
        screenWidth = window.innerWidth;
        var currentPosPercentage = (screenWidth - pageX) / screenWidth;
        var speed;

        if (currentPosPercentage > THRESHOLD ) {
            speed = calculateSpeed(LEFT, currentPosPercentage);
            setScroll(gallery, LEFT, speed)
        } else if (currentPosPercentage < (1 - THRESHOLD)) {
            speed = calculateSpeed(RIGHT, currentPosPercentage);
            setScroll(gallery, RIGHT, speed)
        } else {
            endScroll();
        }

    }
}

function calculateSpeed(direction, ratio) {
    var positionPercentage = direction === LEFT ? ratio : 1 - ratio,
        speedPercentage = (positionPercentage - THRESHOLD) / (1 - THRESHOLD);
    return speedPercentage * MAX_SPEED;
}


function endScroll() {
    clearInterval(scrolling);
}

function setScroll(object, direction, speed) {
    endScroll();
    scrolling = setInterval(function() {
        var newPos = direction === LEFT ? (-1 * speed) : speed;
        object.scrollLeft += newPos
    }, 10);
}

class Jukebox extends Component {
    state = {
        midiFiles: [],
    }

    async componentDidMount() {
        const data = await getMidiFiles(this.props.filterParams);
        if(data){
            this.setState({midiFiles:data})
        }
    }

    componentWillMount() {
        document.addEventListener("DOMContentLoaded", function(event) {
            enableGalleryScroll();
        });

    }
    render() {
        const midiFileElements = this.state.midiFiles.map((midifile,index) => {
            return(
                <MidiCard
                    key={midifile._id}
                    id={midifile._id}
                    name={midifile.name}
                    tempo={midifile.tempo}
                    length={midifile.length}
                    authorId = {midifile.author}
                    sequence={midifile.midi_sequence}
                />
            )
        })
        return (
            <div className="Jukebox">
                <CollectionHeader title={this.props.title}/>
                <div className="gallery centerized" id="gallery">
                {midiFileElements}
                </div>
            </div>
        );
    }
}

export default Jukebox;