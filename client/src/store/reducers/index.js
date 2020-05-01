import { combineReducers } from 'redux';
import midiReducer from './midi';
import authReducer from './auth';

export default combineReducers({
    midi:midiReducer,
    auth:authReducer
});
