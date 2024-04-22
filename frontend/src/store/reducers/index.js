import {combineReducers} from "redux";
import reviewReducer from "./reviewReducer.js";
import dashboardReducer from "./dashboardReducer.js";

export default combineReducers({
    review: reviewReducer,
    dashboard: dashboardReducer
});
