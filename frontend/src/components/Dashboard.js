import React from "react";
import "./Dashboard.css";
import CurrentlyReading from "./CurrentlyReading";
import SocialCards from "./SocialCards";
import { Header } from "./Header";

const Dashboard = () => {
    return (
        <>
            <Header/>
            <div className="dashboardContent">
                <div className="currentlyReading">
                    <CurrentlyReading/>
                </div>
                <div className="socialCards">
                    <SocialCards/>
                </div>
            </div>
        </>
    )
}

export default Dashboard;