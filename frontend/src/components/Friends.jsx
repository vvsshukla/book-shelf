import React, { useState } from "react";
import { Header } from "./Header";
import axios from "axios";
import "./Friends.css";
import { Reader } from "./Reader";

export const Friends = () => {
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const [message, setMessage] = useState('');
    const searchFriends = async (evt) => {
        if (evt.key === 'Enter' || evt.type === 'click') {
            let headers = {'Content-Type':'application/json'};
            let data = {'email':search};
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

    return (
        <>
            <Header />
            <div id="friendsDiv">
                <h3>Friends</h3>
                <div className="search-form">
                    <input type="text" id="search-friends" placeholder="Search By Friend Email" value={search} onChange={(e)=>setSearch(e.target.value)} onKeyDown={searchFriends}/>
                    <button type="button" onClick={searchFriends}>🔍</button>
                </div>
                <div id="searchResults">
                    {/* <div class="reader">
                        <img src="https://s.gr-assets.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png" alt="User Profile" id="profile-photo"/>
                        <div class="readerDetails">
                            <div class="readerName capitalize">madhura mulay</div>
                            <div class="readerBooks">4 Books</div>
                        </div>
                        <button>+</button>
                    </div> */}
                    {result.length > 1 ? (result?.map((reader) => <Reader reader={reader}/>)) : (result.length !== 0 ? <Reader reader={result}/> : <p className="failureMessage">{message}</p>)}
                </div>
            </div>
        </>
    );
}

