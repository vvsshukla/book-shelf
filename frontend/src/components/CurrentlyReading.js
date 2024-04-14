import React, { useEffect, useState } from "react";

const CurrentlyReading = () => {
    const [loading, setLoading] = useState(true);
    const [currentlyReading, setCurrentlyReading ] = useState([]);
    useEffect(()=>{
        setTimeout(function(){
            setLoading(false);
        }, 2000);
    }, []);
    return (
        <div id="currentlyReading">
            <h3>Currently Reading</h3>
            {loading ? <div>Loading...</div> : <p>Search here.</p>}
        </div>
    );
}

export default CurrentlyReading;