import {connect} from "react-redux";
import {Redirect} from "react-router-dom";

import React, {Component} from 'react';

class Logout extends Component {
    componentDidMount() {
    }

    render() {
        return (
            <div>
                <Redirect to='/'/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
    }
};
const mapDispatchToProps = dispatch => {
    return {
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(Logout);
