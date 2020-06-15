import classes from './numberinput.module.css';
import React, {Component} from 'react';

//TODO allow for continuous increment/decrement mousedown
class NumberInput extends Component {
    componentDidMount() {
        const increment_button = document.getElementById(this.props.id + "_increment_btn")
        increment_button.addEventListener('click', () => {
            const e = new Event('input', { bubbles: true })
            const input = document.getElementById(this.props.id)
            this.setNativeValue(input, this.props.value + 1);
            input.dispatchEvent(e)
        })
        const decrement_button = document.getElementById(this.props.id + "_decrement_btn")
        decrement_button.addEventListener('click', () => {
            const e = new Event('input', { bubbles: true })
            const input = document.getElementById(this.props.id)
            this.setNativeValue(input, this.props.value - 1);
            input.dispatchEvent(e)
        })
    }

    setNativeValue = (element, value) => {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
    }

    render() {
        return (
            <div className={classes.NumberInput}>
                <input
                    id={this.props.id}
                    type="number"
                    value={this.props.value}
                    onChange={this.props.onChangeHandler}
                />
                <div className={classes.Arrows}>
                    <button id={this.props.id + "_increment_btn"} type={"button"} >
                        <i className="fa fa-caret-up"/></button>
                    <button id={this.props.id + "_decrement_btn"} type={"button"} >
                        <i className="fa fa-caret-down"/></button>
                </div>
            </div>
        );
    }
}

export default NumberInput;
