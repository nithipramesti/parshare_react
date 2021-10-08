import { combineReducers } from "redux";
import userReducers from './user';

export default combineReducers({
    user : userReducers
})