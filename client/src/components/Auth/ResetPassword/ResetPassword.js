import React, {Component} from 'react';
import PageHeader from "../../../UI/PageHeader/PageHeader";
import classes from "../auth.module.css";
import Button from "../../../UI/Button/Button";

class ResetPassword extends Component {
    state = {
        forgotPasswordForm: {
            email: {
                value: '',
            }
        },
        errors:null,
        success:null
    };

    inputChangeHandler = (event) => {
        const input = event.target.id;
        const currentValue = event.target.value;
        this.setState(prevState => {
            const updatedForm = {
                ...prevState.forgotPasswordForm,
                [input]: {
                    ...prevState.forgotPasswordForm[input],
                    value: currentValue
                }
            };
            return {forgotPasswordForm: updatedForm, errors: null};
        });
    };

    forgotPasswordHandler = async (event, data) => {
        event.preventDefault();
    };
    render() {
        return (
            <React.Fragment>
                <PageHeader title={"Forgot Password"}/>
                <div className={classes.Error}>
                    {this.state.errors}
                </div>
                <div className={classes.Success}>
                    {this.state.success}
                </div>
                <div className={classes.Auth}>
                    <form onSubmit={e => this.forgotPasswordHandler(e, {
                        email: this.state.forgotPasswordForm.email.value,
                    })}>
                        <label>Email address</label>
                        <input
                            id="email"
                            type="email"
                            control="input"
                            className="form-control"
                            placeholder="Enter email"
                            value={this.state.forgotPasswordForm['email'].value}
                            onChange={this.inputChangeHandler}
                        />
                        <Button type={'submit'} title={'Reset Password'} Inverted={true} />
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default ResetPassword;