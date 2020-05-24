import * as actionTypes from '../actions/actionTypes'

const initialState = {
        userId: "",
        userAccessToken: "",
        isLoggedIn: false
};

const reducer = (state= initialState, action) => {

    switch (action.type) {
        case actionTypes.SET_USER_DATA:
            return {
                ...state,
                userAccessToken: action.userData.userAccessToken,
                userId: action.userData.userId,
                isLoggedIn: true
            };
        case actionTypes.USER_LOGOUT:
            return {
                ...state,
                userAccessToken: "",
                userId: "",
                isLoggedIn: false
            };
        default:
            return {...state};
    }
};

export default reducer;