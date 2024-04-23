import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

export const Header = () => {
    const { user, logout } = useAuth();
    const handleLogout = () => {
        console.log('logout');
        logout();
    }
    const [openProfile, setOpenProfile] = useState(false);
    const openProfilePanel = () => {
        let profileParentElement = document.getElementById('profile-photo').parentElement;
        let currentColor = window.getComputedStyle(profileParentElement).backgroundColor;
        if (currentColor === 'rgba(0, 0, 0, 0)') {
            profileParentElement.style.backgroundColor = '#000';
        } else {
            profileParentElement.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        }
        setOpenProfile(!openProfile);
    }
    return (
        <header>
            <div className="logo">
                <span>BookShelf</span>
            </div>
            <nav>
                <ul>
                    <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                    <li><NavLink to="/mybookshelf">My Bookshelf</NavLink></li>
                    {/* <li><NavLink to="/favorite-genres">Favorite Genres</NavLink></li> */}
                </ul>
            </nav>
            {/* <form className="search-form">
                <input type="text" id="search-books" placeholder="Search..." />
                <button type="submit">&#128269;</button>
            </form> */}
            <div className="user-profile">
                <img src="https://s.gr-assets.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png" alt="User Profile" id="profile-photo" onClick={openProfilePanel} />
                {openProfile ? <div className="profile-panel" id="profile-panel">
                    <ul>
                        <li>{user?.firstname} {user?.lastname}</li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="">Friends</Link></li>
                        <li><Link to="" onClick={handleLogout}>Logout</Link></li>
                    </ul>
                </div> : ''}
            </div>
        </header>
    )
};

