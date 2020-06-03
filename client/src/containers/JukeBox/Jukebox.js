import React, {Component} from 'react';
import "./jukebox.scss";
import {deleteMidiFile, getMidiFiles} from "../../utils/MidiQueries";
import MidiCard from "../../components/Midi/MidiCards/MidiCard/MidiCard";
import CollectionHeader from "../../UI/CollectionHeader/CollectionHeader";
import Spinner from "../../UI/Spinner/Spinner";

class Jukebox extends Component {
    state = {
        THRESHOLD : 0.6,
        MAX_SPEED : 5,
        LEFT : 'left',
        RIGHT : 'right',
        midiFiles: [],
        isLoading:false
    }

    async componentDidMount() {
        this.enableGalleryScroll();
        this.setState({isLoading:true})
        const data = await getMidiFiles(this.props.filterParams);
        if(data){
            this.setState({midiFiles:data, isLoading:false})
        }
    }

    enableGalleryScroll = () => {
        var gallery = document.getElementById('gallery_' + this.props.title);
        gallery.onmouseover = (event) => {
            const pageX = event.clientX || event.screenX;
            const screenWidth = window.innerWidth;
            var currentPosPercentage = (screenWidth - pageX) / screenWidth;
            var speed;
            if (currentPosPercentage > this.state.THRESHOLD ) {
                speed = this.calculateSpeed(this.state.LEFT, currentPosPercentage);
                this.setScroll(gallery, this.state.LEFT, speed)
            } else if (currentPosPercentage < (1 - this.state.THRESHOLD)) {
                speed = this.calculateSpeed(this.state.RIGHT, currentPosPercentage);
                this.setScroll(gallery, this.state.RIGHT, speed)
            } else {
                this.endScroll();
            }
        }
    }

    calculateSpeed = (direction, ratio) => {
        var positionPercentage = direction === this.state.LEFT ? ratio : 1 - ratio,
            speedPercentage = (positionPercentage - this.state.THRESHOLD) / (1 - this.state.THRESHOLD);
        return speedPercentage * this.state.MAX_SPEED;
    }

    endScroll = () => {
        clearInterval(this.scrolling);
    }

    setScroll = (object, direction, speed) => {
        this.endScroll();
        this.scrolling = setInterval(() => {
            var newPos = direction === this.state.LEFT ? (-1 * speed) : speed;
            object.scrollLeft += newPos
        }, 10);
    }

    handleDeletePattern = async (id, userId) => {
        const response = await deleteMidiFile(id, userId);
        console.log(response)
        if(response){
            console.log(this.state)
            const midiFilesCopy = [...this.state.midiFiles];
            const midiFilesUpdated = midiFilesCopy.filter(midifile =>{
                return midifile._id.toString() !== id;
            })
            this.setState({midiFiles:midiFilesUpdated})
        }
        else{
            alert("Could Not Delete Midi File. Please Try Again.")
        }
    }

    midiFileElements = () => {
        if (this.state.midiFiles.length > 0){
            return this.state.midiFiles.map((midifile, index) => {
                return (
                    <MidiCard
                        key={midifile._id}
                        id={midifile._id}
                        name={midifile.name}
                        tempo={midifile.tempo}
                        length={midifile.length}
                        authorId={midifile.author}
                        sequence={midifile.midi_sequence}
                        url={midifile.url}
                        onDelete={this.handleDeletePattern}
                        authorName={midifile.author_name}
                    />
                )
            })
        }
        else{
            return <h1>No Beats Available</h1>
        }
    }


    render() {
        return (
            <div className="Jukebox">
                <CollectionHeader title={this.props.title}/>
                <div className="gallery centerized" id={"gallery_" + this.props.title}>
                    {this.state.isLoading ?
                        <Spinner/>
                        :
                        this.midiFileElements()
                    }
                </div>
            </div>
        );
    }
}

export default Jukebox;