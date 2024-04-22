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
        let userData = {userId: user._id};
        let response = await axios.post('http://localhost:5000/api/fetchUpdates', userData, headers);
        console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            console.log('socialCardUpdates:', response.data);
            setSocialCardUpdates(response.data);
            setLoading(false);
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
                                            <SocialCard book={book} user={user} rating={update.rating}/>
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