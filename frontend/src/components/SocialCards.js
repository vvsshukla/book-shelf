import React, { useEffect, useState } from "react";
import { SocialCard } from "./SocialCard";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const SocialCards = () => {
    const [loading, setLoading] = useState(true);
    const [socialCardUpdates, setSocialCardUpdates] = useState([]);
    let { user } = useAuth();

    const fetchUpdatesByFriends = async () => {
        let headers = { 'Content-type': 'application/json' };
        let data = { userId: user._id };
        let response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/fetchfriends', data, headers);
        if (typeof response.data.success !== "undefined" && response.data.success === true && typeof response.data.friends !== "undefined") {
            let friends = response.data.friends;
            let myFriendsIds = [];
            friends.forEach(friend => {
                if (user._id === friend.senderId._id) {
                    myFriendsIds.push(friend.receiverId._id);
                } else {
                    myFriendsIds.push(friend.senderId._id);
                }
            });
            let userData = { userId: user._id, friendIds: myFriendsIds };
            let updateResponse = await axios.post(process.env.REACT_APP_SERVER_URL+'api/fetchupdates', userData, headers);
            if (typeof updateResponse !== "undefined" && typeof updateResponse.data !== "undefined") {
                setSocialCardUpdates(updateResponse.data);
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        fetchUpdatesByFriends();
    }, []);

    return (
        <div id="socialCards">
            {
                loading ?
                    <div className="loaderDiv"><FontAwesomeIcon icon={faSpinner} size="2x" spin /></div> :
                    <div id="socialCardUpdates">
                        <h3 className="dashboardHeadings">Social Cards</h3>
                        {
                            socialCardUpdates?.length > 0
                                ? socialCardUpdates?.map((update) => {
                                    let book = update.bookId;
                                    let user = update.userId;
                                    return (
                                        <SocialCard update={update} />
                                    )
                                })
                                : <div className="fallBackMsg">No new updates.</div>
                        }
                    </div>
            }
        </div>
    );
}

export default SocialCards;