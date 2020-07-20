import React, {Component} from 'react';
import classes from './contact.module.css';
import PageHeader from "../../UI/PageHeader/PageHeader";
import axios from 'axios';
import Logo from "../../UI/Logo/Logo";
import Button from "../../UI/Button/Button";
import {sendAdminEmail} from "../../utils/AuthQueries";

class Contact extends Component {
    state = {
        contactForm: {
            name: {
                value: '',
            },
            email: {
                value: '',
            },
            message: {
                value: '',
            }
        },
        errors:null,
        successMessage: null
    };


    inputChangeHandler = (event) => {
        const input = event.target.id;
        const currentValue = event.target.value;
        this.setState(prevState => {
            const updatedForm = {
                ...prevState.contactForm,
                [input]: {
                    ...prevState.contactForm[input],
                    value: currentValue
                }
            };
            return {contactForm: updatedForm, errors: null, successMessage: null};
        });
    };

    submitHandler = async (event, data) => {
        event.preventDefault();
        const subject = `${data.name} has sent you a Message.`;
        const content = data.message +
            "<br>" + "Name: " + data.name +
            "<br>" + "Email: " + data.email
        const request = {
            "subject": subject,
            "content": content
        };
        const response = await sendAdminEmail(request);
        if(response && response.data.message == "success") {
            this.setState({successMessage:"Message Successfully Sent"});
            this.setState({contactForm: {
                    ...this.state.contactForm,
                    name: { value: ""},
                    email: { value: ""},
                    message: { value: ""}
                }});
        }
        else{
            this.setState({errors:"Something Went Wrong!", successMessage:null});
        }
    };

    render() {
        return (
            <React.Fragment>
                <PageHeader title={"Contact"}/>
                <div className={classes.Success}>
                    {this.state.successMessage}
                </div>
                <div className={classes.Error}>
                    {this.state.errors}
                </div>
                <div className={classes.Contact} >
                    <div className={classes.ContactForm}>
                        <form ref="messageForm" onSubmit={e => this.submitHandler(e,{
                            name : this.state.contactForm.name.value,
                            email: this.state.contactForm.email.value,
                            message : this.state.contactForm.message.value
                        })}>
                            <label>Name</label>
                            <input
                                id="name"
                                type="name"
                                control="input"
                                className="form-control"
                                placeholder="Enter Name"
                                value={this.state.contactForm['name'].value}
                                onChange={this.inputChangeHandler}
                                required
                            />
                            <label>Email</label>
                            <input
                                id="email"
                                type="email"
                                control="input"
                                className="form-control"
                                placeholder="Enter Email Name"
                                value={this.state.contactForm['email'].value}
                                onChange={this.inputChangeHandler}
                                required
                            />
                            <label>Message</label>
                            <textarea
                                id="message"
                                type="textarea"
                                control="input"
                                className="form-control"
                                placeholder="Your Message"
                                value={this.state.contactForm['message'].value}
                                onChange={this.inputChangeHandler}
                                required
                            />
                            <Button type="submit" Inverted={true} title={"Submit"}/>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Contact;