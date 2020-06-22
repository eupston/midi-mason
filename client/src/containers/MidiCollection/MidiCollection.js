import React, {Component} from 'react';
import {getMidiFiles} from "../../utils/MidiQueries";
import MidiCard from "../../components/Midi/MidiCards/MidiCard/MidiCard";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import classes from './midicollection.module.css';


class MidiCollection extends Component {
    state = {
        midiFiles: [],
    }

    async componentDidMount() {
        const data = await getMidiFiles(this.props.filterParams);
        if(data){
            this.setState({midiFiles:data})
        }
    }

    responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5,
            slidesToSlide:1 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

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
                    authorName={midifile.author_name}
                    genre={midifile.genre}
            />
            )
        })
        return (
            <div className={classes.MidiCollection}>
                <div className={classes.Title}>
                    <h3>{this.props.title}</h3>
                </div>
                <Carousel
                    // centerMode={true}
                    partialVisibilityGutter={10}
                    swipeable={true}
                    draggable={true}
                    showDots={false}
                    responsive={this.responsive}
                    infinite={false}
                    autoPlay={true}
                    autoPlaySpeed={5000}
                    keyBoardControl={true}
                    customTransition="all 1.2s linear"
                    transitionDuration={500}
                    minimumTouchDrag={80}
                    containerClass="carousel-container"
                    // removeArrowOnDeviceType={["tablet", "mobile"]}
                    deviceType={this.props.deviceType}
                >
                    {midiFileElements}
                </Carousel>
            </div>
        );
    }
}

export default MidiCollection;