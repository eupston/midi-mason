import * as actionTypes from '../actions/actionTypes';

export const setUserAccessToken = (accessToken) => {
    return {
        type:actionTypes.SET_USER_ACCESS_TOKEN,
        userAccessToken: accessToken
    };
};

export const setUserId = (userId) => {
    return {
        type:actionTypes.SET_USER_ID,
        userId: userId
    };
};

export const userLogout = () => {
    return {
        type:actionTypes.USER_LOGOUT,
    };
};
