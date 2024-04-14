import React, { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import "./Dashboard.css";
import MyBooks from "./MyBooks";
import CurrentlyReading from "./CurrentlyReading";
import SocialCards from "./SocialCards";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
    const {user, logout } = useAuth();
    const [openProfile, setOpenProfile] = useState(false);
    const [mainContent, setMainContent] = useState('dashboard');

    const openProfilePanel = () => {
        let profileParentElement = document.getElementById('profile-photo').parentElement;
        let currentColor = window.getComputedStyle(profileParentElement).backgroundColor;
        if (currentColor == 'rgba(0, 0, 0, 0)') {
            profileParentElement.style.backgroundColor = '#000';
        } else {
            profileParentElement.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        }
        setOpenProfile(!openProfile);
    }

    const handleLogout = () => {
        console.log('logout');
        logout();
    }

    const navigate = (event, mainContent) => {
        let current = document.getElementsByClassName('active');
        current[0].className = current[0].className.replace(' active', '');
        let element = event.target;
        element.classList.add('active');
        // console.log('Event target text:', element.textContent);
        // console.log('Element:', element);
        setMainContent(mainContent);
    }

    const renderComponent = () => {
        switch (mainContent) {
            case 'dashboard':     
                return <><CurrentlyReading /><SocialCards /></>;
            case 'mybooks':
                return <MyBooks />;
            default: return null;
        }
    }
    return (
        <div id="dashboardDiv">
            <header>
                <div className="logo">
                    <span>BookShelf</span>
                </div>
                <nav>
                    <ul>
                        <li><button className="btn active" onClick={(e) => navigate(e,'dashboard')}>Dashboard</button></li>
                        <li><button className="btn" onClick={(e) => navigate(e,'mybooks')}>My Books</button></li>
                        <li><button className="btn" to="/favorite-genres">Favorite Genres</button></li>
                    </ul>
                </nav>
                <form className="search-form">
                    <input type="text" className="search-books" placeholder="Search..." />
                    <button type="submit">&#128269;</button>
                </form>
                <div className="user-profile">
                    <img src="https://s.gr-assets.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png" alt="User Profile" id="profile-photo" onClick={openProfilePanel} />
                    {openProfile ? <div className="profile-panel" id="profile-panel">
                        <ul>
                            <li>{user?.firstname} {user?.lastname}</li>
                            <li><Link to="">Profile</Link></li>
                            <li><Link to="">Friends</Link></li>
                            <li><Link to="" onClick={handleLogout}>Logout</Link></li>
                        </ul>
                    </div> : ''}

                </div>
            </header>
            <main>
                {renderComponent()}
            </main>
        </div>
    )
}

export default Dashboard;