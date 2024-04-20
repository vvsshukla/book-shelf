import {combineReducers} from "redux";
import reviewReducer from "./reviewReducer.js";

export default combineReducers({
    review: reviewReducer
});
