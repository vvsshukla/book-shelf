import React, { useEffect, useState } from "react";
import { Header } from "./Header";
import axios from "axios";
import "./Friends.css";
import { Reader } from "./Reader";
import "./TabComponent.css";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { reset } from "../store/actions/friendActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faSpinner } from "@fortawesome/free-solid-svg-icons";

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
    const [friendIds, setFriendIds] = useState([]);
    const [loader, setLoader] = useState(1);
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

    const validateSearch = () => {
        if (!search.trim()) {
            setSearchMessage(<span className="failureMessage">Search cannot be empty.</span>);
            return false;
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(search.trim()))) {
            setSearchMessage(<span className="failureMessage">Please enter valid email address.</span>);
            return false;
        } else {
            setSearchMessage('');
            return true;
        }                         
    }

    const searchFriends = async (evt) => {
        if (evt.key === 'Enter' || evt.type === 'click') {
            if (validateSearch()) {
                let headers = { 'Content-Type': 'application/json' };
                let data = { 'email': search };
                let response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/searchuser', data, headers);
                let userResult = typeof response.data !== "undefined" ? response.data : '';
                if (typeof userResult.user !== "undefined" && userResult.user !== null) {
                    setResult(userResult.user);
                } else {
                    setResult([]);
                    setSearchMessage(<span className="failureMessage">{userResult.message}</span>);
                }
            }
        }
    }

    const fetchFriendRequests = async () => {
        let headers = { 'Content-type': 'application/json' };
        let data = { receiverId: user._id };
        let response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/friendrequests', data, headers);
        if (typeof response !== "undefined" && typeof response.data.success !== "undefined" && response.data.success === true) {
            let requests = response.data.requests;
            setFriendRequests(requests);
            if (requests.length === 0) {
                setNotificationMessage(<span className="infoMessage">No new friend request.</span>);
            }
        } else {
            setNotificationMessage(<span className="failureMessage">{response.data.message}</span>);
        }
        setLoader(0);
    }

    const fetchFriends = async () => {
        let headers = { 'Content-type': 'application/json' };
        let data = { userId: user._id };
        let response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/fetchfriends', data, headers);
        if (typeof response.data.success !== "undefined" && response.data.success === true) {
            let friends = response.data.friends;
            let myFriendsIds = [];
            friends.forEach(friend => {
                if (user._id === friend.senderId._id) {
                    myFriendsIds.push(friend.receiverId._id);
                } else {
                    myFriendsIds.push(friend.senderId._id);
                }
            });
            setFriendIds(myFriendsIds);
            setFriends(friends);
            if (friends.length === 0) {
                setMessage(<span className="infoMessage">You have no friends.</span>);
            }
        } else {
            setMessage(<span className="failureMessage">{response.data.message}</span>);
        }
        setLoader(0);
    }

    const populateTabContent = (tabId) => {
        if (tabId === 1 || tabId === 3) {
            setLoader(1);
        }

        switch (tabId) {
            case 1:
                fetchFriends();
                break;
            case 2:
                console.log('populateTabContent searchFriends');
            case 3:
                console.log('populateTabContent fetchFriendRequests');
                fetchFriendRequests();
                break;

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
                        {result.length > 1 ? (result?.map((reader) => <Reader reader={reader} friendIds={friendIds} />)) : (result.length !== 0 ? <Reader reader={result} friendIds={friendIds} /> : searchMessage)}
                    </div>
                </>;
            case 3:
                console.log('fetchFriendRequests');
                return <>
                    <div id="searchResults">
                        {friendRequests.length > 0 ? (friendRequests?.map((reader) => <Reader reader={reader} userType="receiver" />)) : notificationMessage}
                    </div>
                </>;
            default:
                return;
        }
    }

    useEffect(() => {
        dispatch(reset());
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
                                onItemClicked={() => { setActive(id); setActiveTab(id); populateTabContent(id); }}
                                isActive={active === id}
                            />)}
                    </div>
                    <div className="content">
                        {loader == 1 ? <FontAwesomeIcon icon={faSpinner} size="2x" spin color="gray" /> : renderTabContent()}
                    </div>
                </div>
            </div>
        </>
    );
}

