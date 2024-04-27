import {combineReducers} from "redux";
import reviewReducer from "./reviewReducer.js";
import dashboardReducer from "./dashboardReducer.js";
import friendReducer from "./friendReducer.js";

export default combineReducers({
    review: reviewReducer,
    dashboard: dashboardReducer,
    friend: friendReducer
});
