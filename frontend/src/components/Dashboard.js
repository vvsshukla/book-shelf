import React from "react";
import "./Dashboard.css";
import CurrentlyReading from "./CurrentlyReading";
import SocialCards from "./SocialCards";
import { Header } from "./Header";
import { Recommendations } from "./Recommendations";

const Dashboard = () => {
    return (
        <>
            <Header/>
            <div className="dashboardContent">
                <div className="upperHalf">
                    <div className="currentlyReading">
                        <CurrentlyReading/>
                    </div>
                    <div className="socialCards">
                        <SocialCards/>
                    </div>
                </div>
                <h3 id="recommendationHeading">Recommendations by Bookshelf</h3>
                <div className="lowerHalf">
                    <Recommendations/>
                </div>
            </div>
            
        </>
    )
}

export default Dashboard;