import * as actionTypes from '../actions/actionTypes';

export const setUserData = (userData) => {
    return {
        type:actionTypes.SET_USER_DATA,
        userData: userData
    };
};

export const userLogout = () => {
    return {
        type:actionTypes.USER_LOGOUT,
    };
};
