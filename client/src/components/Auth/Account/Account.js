import React, {Component} from 'react';
import classes from '../auth.module.css';
import PageHeader from "../../../UI/PageHeader/PageHeader"
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import Button from "../../../UI/Button/Button";

class Account extends Component {
    state = {
        userForm: {
            userName: {
                value: '',
            },
            email: {
                value: '',
            },
        },
        id: null,
        redirect: false,
        success: null
    };
    
    async componentWillMount () {

    };
    
    inputChangeHandler = (event) => {
        const input = event.target.id;
        const currentValue = event.target.value;
        this.setState(prevState => {
            const updatedForm = {
                ...prevState.userForm,
                [input]: {
                    ...prevState.userForm[input],
                    value: currentValue
                }
            };
            return {userForm: updatedForm,errors: null, success:null};
        });
    };

    submitHandler = async (event, data) => {
        event.preventDefault();

    };

    render() {
        return (
            <React.Fragment>
                {this.state.redirect ? <Redirect to="/login"/> : null}
                <PageHeader title="Account"/>
                    <div className={classes.Error}>
                        {this.state.errors}
                    </div>
                    <div className={classes.Success}>
                        {this.state.success}
                    </div>
                    <div className={classes.Auth}>
                        <form  onSubmit={e => this.submitHandler(e,{
                            userName : this.state.userForm.userName.value,
                            email: this.state.userForm.email.value,
                        })}>
                            <label>User Name</label>
                            <input
                                id="userName"
                                type="name"
                                control="input"
                                className="form-control"
                                placeholder="Enter First Name"
                                value={this.state.userForm['userName'].value}
                                onChange={this.inputChangeHandler}
                            />
                            <label>Email address</label>
                            <input
                                id="email"
                                type="email"
                                control="input"
                                className="form-control"
                                placeholder="Enter email"
                                value={this.state.userForm['email'].value}
                                onChange={this.inputChangeHandler}
                            />
                            <Button type={'submit'} title={'Update Information'} Inverted={true} />
                        </form>

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

export default connect(mapStateToProps)(Account);