import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import * as authActions from "../../../store/actions";

import React, {Component} from 'react';

class Logout extends Component {
    componentDidMount() {
        this.props.userLogout()
    }

    render() {
        return (
            <div>
                <Redirect to='/'/>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userLogout: () => dispatch(authActions.userLogout()),
    }
};
export default connect(null,mapDispatchToProps)(Logout);
