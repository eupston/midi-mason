import React, {Component} from 'react';
import classes from './save.module.css';
import Button from "../Button/Button";
import Spinner from "../Spinner/Spinner";
import Modal from "../Modal/Modal";

class SaveForm extends Component {
    state = {
        saveForm: {
            name: {
                value: '',
            },
            genre: {
                value: '',
            }
        },
        errors:null,
    };

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
                        genre: this.state.saveForm.genre.value
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

                        <br/>
                        <Button type={'submit'} title={'Save Pattern'} Inverted={true}/>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}


export default SaveForm;