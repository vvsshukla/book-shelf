import { useEffect, useState } from "react";
import React from "react";
import { Header } from "./Header";
import { useAuth } from "../hooks/useAuth";
import "./Review.css";
import { Rating } from "react-simple-star-rating";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { BookCard } from "./BookCard";

const Review = () => {
    const [messsage, setMessage] = useState('');
    const [loader, setLoader] = useState(true);
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const {bookId} = useParams();
    const {user} = useAuth();
    const handleRating = async (rating) => {
        setRating(rating);
    }

    const fetchReview = async () => {
        let headers = {'Content-type': 'application/json'};
        let userData = {userId: user._id, bookId: bookId};
        let response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/fetchReview', userData, headers);
        console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            let reviewDetails = response.data;
            if (typeof reviewDetails.rating !=="undefined") {
                setRating(reviewDetails.rating);
            }
            if (typeof reviewDetails.comment !== "undefined") {
                setContent(reviewDetails.comment);
            }
            setLoader(false);
        }
    }

    const submitReview = async (e) => {
        e.preventDefault();
        const headers = {
            'Content-Type': 'application/json'
        }
        let data = {
            rating: rating,
            userId: user._id,
            bookId: bookId,
            comment: content
        }
        const response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/updaterating', data, headers);
        console.log('response:', response);
    }

    useEffect(()=>{
        if (bookId) {
            fetchReview();
        }
    }, []);
    return <>
        <Header />
        <div id="reviewDiv">
            <BookCard book={bookId}/>
            <div className="reviewContent">
                <h3>Write Your Review</h3>
                {messsage ? <p>{messsage}</p> : ''}
                {loader ? <FontAwesomeIcon icon={faSpinner} size="2x"/> : <form onSubmit={submitReview}>
                                <div className="contentRow">
                                    <label className="contentLabel">Rating</label>
                                    <div className="reviewContentValue">
                                        <Rating
                                            initialValue={rating}
                                            size={18}
                                            transition
                                            fillColor="gold"
                                            emptyColor="lightgray"
                                            onClick={handleRating}
                                        />
                                    </div>
                                </div>
                                <div className="contentRow">
                                    <label className="contentLabel">What do you think?</label>
                                    <div className="reviewContentValue"><textarea value={content} onChange={(e) => setContent(e.target.value)} /></div>
                                </div>
                                <div className="contentRow">
                                    <button type="submit">Submit</button>
                                </div>
                            </form>
                }
            </div>
        </div>
    </>;
}

export default Review;