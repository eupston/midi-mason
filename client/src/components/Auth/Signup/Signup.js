import React, {Component} from 'react';
import { Redirect } from "react-router-dom";
import classes from '../auth.module.css';
import PageHeader from "../../../UI/PageHeader/PageHeader";
import Button from "../../../UI/Button/Button";
import {signup} from "../../../utils/AuthQueries";

class Signup extends Component {
    state = {
        signupForm: {
            userName: {
                value: '',
            },
            email: {
                value: '',
            },
            password: {
                value: '',
            },
            confirmedPassword: {
                value: '',
            }
        },
        isSignedUp: false,
        errors: null,
        success: null,
    };

    inputChangeHandler = (event) => {
        const input = event.target.id;
        const currentValue = event.target.value;
        this.setState(prevState => {
            const updatedForm = {
                ...prevState.signupForm,
                [input]: {
                    ...prevState.signupForm[input],
                    value: currentValue
                }
            };
            return {signupForm: updatedForm, errors: null};
        });
    };

    signupHandler = async (event, data) => {
        event.preventDefault();
        const request_body = {
            name: data.userName,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmedPassword,
        }
        const response = await signup(request_body);
        if(response){
            this.setState({success: "Successfully Signed up!"});
        }
        else{
            this.setState({errors: "Something went wrong during signup."});
            return null;
        }
    };

    render() {
        return (
            <React.Fragment>
                <PageHeader title={"Signup"}/>
                <div className={classes.Error}>
                    {this.state.errors}
                </div>
                <div className={classes.Success}>
                    {this.state.success}
                </div>
                <div className={classes.Auth}>
                    <form onSubmit={e => this.signupHandler(e, {
                        userName: this.state.signupForm.userName.value,
                        email: this.state.signupForm.email.value,
                        password: this.state.signupForm.password.value,
                        confirmedPassword: this.state.signupForm.confirmedPassword.value,
                    })}>
                        <label>User Name</label>
                        <input
                            id="userName"
                            type="name"
                            control="input"
                            className="form-control"
                            placeholder="Enter User Name"
                            value={this.state.signupForm['userName'].value}
                            onChange={this.inputChangeHandler}
                        />
                        <label>Email address</label>
                        <input
                            id="email"
                            type="email"
                            control="input"
                            className="form-control"
                            placeholder="Enter email"
                            value={this.state.signupForm['email'].value}
                            onChange={this.inputChangeHandler}
                        />
                        <label>Password</label>
                        <input
                            id="password"
                            type="password"
                            control="input"
                            className="form-control"
                            placeholder="Password"
                            value={this.state.signupForm['password'].value}
                            onChange={this.inputChangeHandler}
                        />
                        <label>Confirm Password</label>
                        <input
                            id="confirmedPassword"
                            type="password"
                            control="input"
                            className="form-control"
                            placeholder="Password"
                            value={this.state.signupForm['confirmedPassword'].value}
                            onChange={this.inputChangeHandler}
                        />
                        <Button type={'submit'} title={'Signup'} Inverted={true} />
                    </form>
                    {this.props.redirect ? this.state.isSignedUp ? <Redirect to="/login"/> : null : null}
                </div>
            </React.Fragment>
        );
    }
}

export default Signup;