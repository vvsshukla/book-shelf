import React, { useEffect, useState } from "react";
import { Header } from "./Header";
import axios from "axios";
import "./Friends.css";
import { Reader } from "./Reader";
import "./TabComponent.css";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { reset } from "../store/actions/friendActions";

const TabItemComponent = ({ title, onItemClicked = () => console.error('You passed no action to the component.'), isActive = false }) => {
    return (
        <div className={isActive ? 'tabItem' : 'tabItem tabItemInactive'} onClick={onItemClicked}>
            <p className="tabItemTitle">{title}</p>
        </div>
    )
}

export const Friends = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const [message, setMessage] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [searchMessage, setSearchMessage] = useState('');
    const [active, setActive] = useState(1);
    const [activeTab, setActiveTab] = useState(1);
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const dispatch = useDispatch();
    const tabItems = [
        {
            id: 1,
            title: 'Friends'
        },
        {
            id: 2,
            title: 'Add Friends'
        },
        {
            id: 3,
            title: 'Friend Requests'
        }
    ]

    const searchFriends = async (evt) => {
        if (evt.key === 'Enter' || evt.type === 'click') {
            let headers = { 'Content-Type': 'application/json' };
            let data = { 'email': search };
            let response = await axios.post('http://localhost:5000/api/searchUser', data, headers);
            let userResult = typeof response.data !== "undefined" ? response.data : '';
            console.log('result:', userResult);
            if (typeof userResult.user !== "undefined" && userResult.user !== null) {
                setResult(userResult.user);
            } else {
                setMessage(userResult.message);
            }
            console.log('response:', response);
        }
    }

    const fetchFriendRequests = async () => {
        let headers = { 'Content-type': 'application/json' };
        let data = { receiverId: user._id };
        let response = await axios.post('http://localhost:5000/api/friendRequests', data, headers);
        console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data.success !== "undefined" && response.data.success === true) {
            let requests = response.data.requests;
            console.log('fetchFriendRequests:', requests);
            setFriendRequests(requests);
            if (requests.length === 0) {
                setNotificationMessage(<span className="infoMessage">No new friend request.</span>);   
            }
        } else {
            setNotificationMessage(<span className="failureMessage">{response.data.message}</span>);
        }
    }

    const fetchFriends = async () => {
        let headers = { 'Content-type': 'application/json' };
        let data = { userId: user._id };
        let response = await axios.post('http://localhost:5000/api/fetchFriends', data, headers);
        console.log('response:', response);
        if (typeof response.data.success !== "undefined" && response.data.success === true) {
            let friends = response.data.friends;
            console.log('fetchedFriends:', friends);
            setFriends(friends);
            if (friends.length === 0) {
                setMessage(<span className="infoMessage">You have no friends.</span>);   
            }
        } else {
            setMessage(<span className="failureMessage">{response.data.message}</span>);
        }
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 1:
                return <><div>Friends for {user.email}</div>
                    <div id="searchResults">
                        {friends.length > 0 ? (friends?.map((reader) => <Reader reader={reader} userType="friend" />)) : message}
                    </div></>;
            case 2:
                return <>
                    <div className="search-form">
                        <input type="text" id="search-friends" placeholder="Search Friends By Email" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={searchFriends} />
                        <button type="button" onClick={searchFriends}>🔍</button>
                    </div>
                    <div id="searchResults">
                        {result.length > 1 ? (result?.map((reader) => <Reader reader={reader} />)) : (result.length !== 0 ? <Reader reader={result} /> : searchMessage)}
                    </div></>;
            case 3:
                return <>
                    <div id="searchResults">
                        {friendRequests.length > 0 ? (friendRequests?.map((reader) => <Reader reader={reader} userType="receiver" />)) : notificationMessage}
                    </div></>;
            default:
                return;
        }
    }

    useEffect(() => {
        dispatch(reset());
        fetchFriendRequests();
        fetchFriends();
    }, []);

    return (
        <>
            <Header />
            <div id="friendsDiv">
                <div className="wrapper">
                    <div className="tabs">
                        {tabItems?.map(({ id, title }) =>
                            <TabItemComponent
                                key={title}
                                title={title}
                                onItemClicked={() => { setActive(id); setActiveTab(id); }}
                                isActive={active === id}
                            />)}
                    </div>
                    <div className="content">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </>
    );
}

