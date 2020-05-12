import React, { Component } from "react";
import Glide from "@glidejs/glide";

export default class SliderGlide extends Component {
    state = { id: null };

    componentDidMount = () => {
        // Generated random id
        this.setState(
            { id: `glide-${Math.ceil(Math.random() * 100)}` },
            this.initializeGlider
        );
    };

    initializeGlider = () => {
        this.slider = new Glide(`#${this.state.id}`, this.props.options);
        this.slider.mount();
    };

    componentWillReceiveProps = newProps => {
        if (this.props.options.startAt !== newProps.options.startAt) {
            this.slider.go(`=${newProps.options.startAt}`);
        }
    };

    render = () => (
        // controls
        <div id={this.state.id} className="slider">
            <div className="two-controls-btns" data-glide-el="controls">
                <button className="arrow-left" data-glide-dir="<" title="start">
                    <span className="hidden">Start</span>
                </button>
                <button className="arrow-right" data-glide-dir=">" title="end">
                    <span className="hidden">End</span>
                </button>
            </div>
            {/* track  */}
            <div data-glide-el="track">
                <div style={{ display: "flex" }}>
                    {this.props.children.map((slide, index) => {
                        return React.cloneElement(slide, {
                            key: index,
                            className: `${slide.props.className} your_cutom_classname`
                        });
                    })}
                </div>
            </div>
            {/* bottom bullets , you can comment out this part*/}
            <div className="bottom_bullets" data-glide-el="controls[nav]">
                {this.props.children.map((slide, index) => {
                    return (
                        <button
                            key={index}
                            className="single-bullet"
                            data-glide-dir={"=" + index}
                            title={index}
                        />
                    );
                })}
            </div>
        </div>
    );
}

SliderGlide.defaultProps = {
    options: {}
};
