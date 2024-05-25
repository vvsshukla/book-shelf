import { useState } from "react";
import React from "react";
import { Header } from "./Header";

const Review = () => {
    const [messsage, setMessage] = useState('');
    const [content, setContent] = useState('');
    const review = () => {

    }
    return <>
        <Header />
        <div id="reviewDiv">
            <div className="reviewContent">
                <h3>Write Your Review</h3>
                {messsage ? <p>{messsage}</p> : ''}
                <form onSubmit={review}>
                    <div className="contentRow">
                        <label className="contentLabel">What do you think?</label>
                        <div className="contentValue"><textarea value={content} onChange={(e) => setContent(e.target.value)} /></div>
                    </div>
                    <div className="contentRow profileButton">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </>;
}

export default Review;