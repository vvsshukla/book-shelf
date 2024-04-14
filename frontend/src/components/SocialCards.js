import React, { useEffect, useState } from "react";

const SocialCards = () => {
    const [loading, setLoading] = useState(true);
    const [activities, setActivites] = useState([]);
    useEffect(()=>{
        setTimeout(function(){
            setLoading(false);
        }, 2000);
    }, []);
    return (
        <div id="socialCards">
            <h3>Social Cards</h3>
            {loading ? <div>Loading...</div> : <div>No updates.</div>}
        </div>
    );
}

export default SocialCards;