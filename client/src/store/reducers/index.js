import { combineReducers } from 'redux';
import midiReducer from './midi';

export default combineReducers({
    midi:midiReducer
});
