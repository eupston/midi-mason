import React, {Component} from 'react';
import classes from '../auth.module.css';
import PageHeader from "../../../UI/PageHeader/PageHeader"
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import Button from "../../../UI/Button/Button";

class Account extends Component {
    state = {
        userForm: {
            firstName: {
                value: '',
            },
            lastName: {
                value: '',
            },
            email: {
                value: '',
            },
            phoneNumber: {
                value: '',
            },
            street: {
                value: '',
            },
            city: {
                value: '',
            },
            country: {
                value: '',
            },
            zip: {
                value: '',
            },
        },
        addressId: null,
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
                            firstName : this.state.userForm.firstName.value,
                            lastName : this.state.userForm.lastName.value,
                            email: this.state.userForm.email.value,
                            phoneNumber : this.state.userForm.phoneNumber.value,
                            street : this.state.userForm.street.value,
                            city : this.state.userForm.city.value,
                            country : this.state.userForm.country.value,
                            zip : this.state.userForm.zip.value,
                            addressId: this.state.addressId
                        })}>
                            <label>First Name</label>
                            <input
                                id="firstName"
                                type="name"
                                control="input"
                                className="form-control"
                                placeholder="Enter First Name"
                                value={this.state.userForm['firstName'].value}
                                onChange={this.inputChangeHandler}
                            />
                            <label>Last Name</label>
                            <input
                                id="lastName"
                                type="name"
                                control="input"
                                className="form-control"
                                placeholder="Enter Last Name"
                                value={this.state.userForm['lastName'].value}
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
                            <label>Phone Number</label>
                            <input
                                id="phoneNumber"
                                type="tel"
                                control="input"
                                className="form-control"
                                placeholder="Phone Number (Example: +1 999 999 9999)"
                                value={this.state.userForm['phoneNumber'].value}
                                onChange={this.inputChangeHandler}
                            />
                            <label>Street</label>
                            <input
                                id="street"
                                type="text"
                                control="input"
                                className="form-control"
                                placeholder="street"
                                value={this.state.userForm['street'].value}
                                onChange={this.inputChangeHandler}
                            />
                            <label>City</label>
                            <input
                                id="city"
                                type="text"
                                control="input"
                                className="form-control"
                                placeholder="City"
                                value={this.state.userForm['city'].value}
                                onChange={this.inputChangeHandler}
                            />
                            <label>Country</label>
                            <input
                                id="country"
                                type="text"
                                control="input"
                                className="form-control"
                                placeholder="Country"
                                value={this.state.userForm['country'].value}
                                onChange={this.inputChangeHandler}
                            />
                            <label>Zip Code</label>
                            <input
                                id="zip"
                                type="number"
                                control="input"
                                className="form-control"
                                placeholder="Zip Code"
                                value={this.state.userForm['zip'].value}
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