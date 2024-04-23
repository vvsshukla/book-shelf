import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Header } from "./Header";
import "./Profile.css";

export const Profile = () => {
    const { user } = useAuth();
    console.log('user:', user);
    return  <>
                <Header />
                <div id="profileDiv">
                    <div className="content">
                        <div className="contentRow">
                            <div className="contentLabel">First Name:</div>
                            <div className="contentValue capitalize">{user?.firstname}</div>
                        </div>
                        <div className="contentRow">
                            <div className="contentLabel">Last Name:</div>
                            <div className="contentValue capitalize">{user?.lastname}</div>
                        </div>
                        <div className="contentRow">
                            <div className="contentLabel">Email:</div>
                            <div className="contentValue capitalize">{user?.email}</div>
                        </div>
                        {/* <div className="contentRow">
                            <div className="contentLabel">Phone:</div>
                            <div className="contentValue"></div>
                        </div> */}
                    </div>
                </div>
            </>
}