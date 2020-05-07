import React, {Component} from 'react';
import classes from './save.module.css';
import Button from "../Button/Button";

class SaveForm extends Component {
    state = {
        saveForm: {
            name: {
                value: '',
            },
            genre: {
                value: '',
            },
            generatedSteps: {
                value: this.props.min
            }
        },
        errors:null,
    };

    onKeyPress = (event) =>{
        event.preventDefault();
    }

    inputChangeHandler = (event) => {
        const input = event.target.id;
        const currentValue = event.target.value;
        this.setState(prevState => {
            const updatedForm = {
                ...prevState.saveForm,
                [input]: {
                    ...prevState.saveForm[input],
                    value: currentValue
                }
            };
            return {saveForm: updatedForm, errors: null};
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className={classes.Error}>
                    {this.state.errors}
                </div>
                <div className={classes.SaveForm}>
                    <form onSubmit={e => this.props.onSavePattern(e, {
                        name: this.state.saveForm.name.value,
                        genre: this.state.saveForm.genre.value,
                        generatedSteps: this.state.saveForm.generatedSteps.value
                    })}>
                        <label>Pattern Name</label>
                        <input
                        id="name"
                        type="name"
                        control="input"
                        className="form-control"
                        placeholder="Enter name"
                        value={this.state.saveForm['name'].value}
                        onChange={this.inputChangeHandler}
                        required={true}
                        />
                        <label>Genre</label>
                        <input
                        id="genre"
                        type="genre"
                        control="input"
                        className="form-control"
                        placeholder="Genre"
                        value={this.state.saveForm['genre'].value}
                        onChange={this.inputChangeHandler}
                        required={true}
                        />
                        {this.props.totalsteps ?
                            <React.Fragment>
                                <label>Total Step</label>
                                <input
                                    id="generatedSteps"
                                    type="number"
                                    control="input"
                                    className="form-control"
                                    placeholder={this.props.min}
                                    min={this.props.min}
                                    max={this.props.max}
                                    value={this.state.saveForm['generatedSteps'].value}
                                    onKeyDown={this.onKeyPress.bind(this)}
                                    onChange={this.inputChangeHandler}
                                    required="true"
                                />
                            </React.Fragment>
                            :
                            null
                        }
                        <br/>
                        <Button type={'submit'} title={this.props.button_text} Inverted={true}/>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}


export default SaveForm;