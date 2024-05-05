import React, { useEffect, useState } from "react";
import { SocialCard } from "./SocialCard";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const SocialCards = () => {
    const [loading, setLoading] = useState(true);
    const [socialCardUpdates, setSocialCardUpdates] = useState([]);
    let {user} = useAuth();

    const fetchUpdatesByFriends = async () => {
        let headers = { 'Content-type': 'application/json' };
        let data = { userId: user._id };
        let response = await axios.post('https://book-shelf-xvxk.onrender.com/api/fetchfriends', data, headers);
        console.log('response:', response);
        console.log('fiends:', response.data.friends);
        if (typeof response.data.success !== "undefined" && response.data.success === true && typeof response.data.friends !== "undefined") {
            let friends = response.data.friends;
            console.log('fetchedFriends:', friends);
            let myFriendsIds = [];
            friends.forEach(friend => {
                if (user._id === friend.senderId._id) {
                    myFriendsIds.push(friend.receiverId._id); 
                } else {
                    myFriendsIds.push(friend.senderId._id); 
                }
            });
            let userData = {userId: user._id, friendIds: myFriendsIds};
            let updateResponse = await axios.post('https://book-shelf-xvxk.onrender.com/api/fetchupdates', userData, headers);
            console.log('response:', updateResponse);
            if (typeof updateResponse !== "undefined" && typeof updateResponse.data !== "undefined") {
                console.log('socialCardUpdates:', updateResponse.data);
                setSocialCardUpdates(updateResponse.data);
                setLoading(false);
            }
        }
    }

    useEffect(()=>{
        fetchUpdatesByFriends();
    }, []);

    return (
        <div id="socialCards">
            {
                loading ?
                    <div key="socialCardLoader">Loading...</div> :
                    <div id="socialCardUpdates">
                        <h2>Social Cards</h2>
                        {
                            socialCardUpdates?.length > 0
                                ?   socialCardUpdates?.map((update) => {
                                        let book = update.bookId;
                                        let user = update.userId;
                                        console.log('book:', book);
                                        return (
                                            <SocialCard update={update}/>
                                        )
                                    })
                                : <div>No new updates.</div>
                        }
                    </div>
            }
        </div>
    );
}

export default SocialCards;