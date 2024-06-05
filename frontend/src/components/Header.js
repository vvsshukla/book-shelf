import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";
import { useSelector } from "react-redux";

export const Header = () => {
    const { user, logout } = useAuth();
    const {profileImage} = useSelector(state => state.dashboard);
    let profileImageUrl = "https://s.gr-assets.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png";
    if (profileImage) {
        profileImageUrl = process.env.REACT_APP_SERVER_URL + profileImage; 
    } else if (user?.avatarUrl) {
        profileImageUrl = process.env.REACT_APP_SERVER_URL + user?.avatarUrl;
    }
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

    //Close profile panel when clicked anywhere outside profile section
    document.addEventListener('click', function(event){
        let userProfile = document.getElementsByClassName('user-profile')[0];
        let profileParentElement = document.getElementById('profile-photo')?.parentElement;
        //console.log('profileParentElement:', profileParentElement);
        let targetElement = event.target;
        //console.log("event.target.id:", event.target.id);
        let skipElements = ['logoutLink', 'signIn', 'signUp']; 
        if (targetElement !== userProfile && !userProfile?.contains(targetElement) && !skipElements.includes(event.target.id)) {
            if (openProfile === true && profileParentElement) {
                setOpenProfile(false);
                profileParentElement.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            }
        }                 
    });
    
    return (
        <header>
            <div className="logo">
                <span><Link to="/dashboard" className="logoLink">BookShelf</Link></span>
            </div>
            <nav>
                <ul>
                    <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                    <li><NavLink to="/mybookshelf">My Bookshelf</NavLink></li>
                    <li><NavLink to="/friends">Friends</NavLink></li>
                </ul>
            </nav>
            <div className="user-profile">
                <img src={profileImageUrl} alt="User Profile" id="profile-photo" onClick={openProfilePanel} />
                {openProfile ? <div className="profile-panel" id="profile-panel">
                    <ul>
                        <li>{user?.firstname} {user?.lastname}</li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/friends">Friends</Link></li>
                        <li><Link to="" id="logoutLink" onClick={handleLogout}>Logout</Link></li>
                    </ul>
                </div> : ''}
            </div>
        </header>
    )
};
