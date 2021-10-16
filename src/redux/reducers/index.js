import { combineReducers } from "redux";
import authReducer from "./user";
import cartReducer from "./cart";

export default combineReducers({
  authReducer,
  cartReducer,
});
