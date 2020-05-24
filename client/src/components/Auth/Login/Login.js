import React, {Component} from 'react';
import {connect} from 'react-redux';
import classes from '../auth.module.css';
import {Link, Redirect} from "react-router-dom";
import PageHeader from "../../../UI/PageHeader/PageHeader";
import Button from "../../../UI/Button/Button";
import {sendLoginRequest} from "../../../utils/AuthQueries";
import * as authActions from '../../../store/actions/index';

class Login extends Component {
    state = {
        loginForm: {
            email: {
                value: '',
            },
            password: {
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
                ...prevState.loginForm,
                [input]: {
                    ...prevState.loginForm[input],
                    value: currentValue
                }
            };
            return {loginForm: updatedForm, errors: null};
        });
    };

    loginHandler = async (event, data) => {
        event.preventDefault();
        const request_body = {
            email: data.email,
            password: data.password,
        }
        const response = await sendLoginRequest(request_body);
        if(response){
            const token = response.token
            const userId = response.userId
            const userData = {
                userAccessToken: token,
                userId: userId
            }
            this.props.setUserData(userData);
        }
        else{
            this.setState({errors: "Incorrect email or password."});
            return null;
        }
    };

    render() {
        return (
            <React.Fragment>
                <PageHeader title={"Login"}/>
                <div className={classes.Error}>
                    {this.state.errors}
                </div>
                <div className={classes.Auth}>
                    <form onSubmit={e => this.loginHandler(e, {
                        email: this.state.loginForm.email.value,
                        password: this.state.loginForm.password.value
                    })}>
                        <label>Email address</label>
                        <input
                            id="email"
                            type="email"
                            control="input"
                            className="form-control"
                            placeholder="Enter email"
                            value={this.state.loginForm['email'].value}
                            onChange={this.inputChangeHandler}
                        />
                        <label>Password</label>
                        <input
                            id="password"
                            type="password"
                            control="input"
                            className="form-control"
                            placeholder="Password"
                            value={this.state.loginForm['password'].value}
                            onChange={this.inputChangeHandler}
                        />
                        <Button type={'submit'} title={'Login'} Inverted={true} />
                        <Link to={'/reset-password'}>Forgot Password?</Link>
                        {this.props.redirect ?  <p>New User? <Link to={'/signup'}>Signup</Link></p> : null}
                    </form>
                    {this.props.redirect ? this.props.isLoggedIn ? <Redirect to="/mybeats"/> : null : null}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        accessToken: state.auth.userAccessToken,
        isLoggedIn: state.auth.isLoggedIn,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setUserData: (userData) => dispatch(authActions.setUserData(userData)),
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Login);