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

const headers = {
    'Content-Type': 'application/json'
}

const Review = () => {
    const [messsage, setMessage] = useState('');
    const [loader, setLoader] = useState(true);
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const {bookId, userId} = useParams();
    const {user} = useAuth();
    let bookUserId =  userId ? userId : user._id;
    const handleRating = async (rating) => {
        setRating(rating);
    }
    const [book, setBook] = useState({});

    const fetchReview = async () => {
        let userData = {userId: bookUserId, bookId: bookId};
        let response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/fetchReview', userData, headers);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            let reviewDetails = response.data;
            if (typeof reviewDetails.rating !=="undefined") {
                setRating(reviewDetails.rating);
            }
            if (typeof reviewDetails.comment !== "undefined") {
                setContent(reviewDetails.comment);
            }
        }
    }

    const fetchBookDetails = async () => {
        let data = {
            bookId: bookId
        }
        const response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/book', data, headers);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            setBook(response.data);
            setLoader(false);
        }
    }

    const submitReview = async (e) => {
        e.preventDefault();
        let data = {
            rating: rating,
            userId: user._id,
            bookId: bookId,
            comment: content
        }
        const response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/updaterating', data, headers);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            setMessage('Review Added Successfully.');
        }
    }

    useEffect(()=>{
        if (bookId) {
            fetchReview();
            fetchBookDetails();
        }
    }, []);
    return <>
        <Header />
        <div id="reviewDiv">
            {loader ? <FontAwesomeIcon icon={faSpinner} size="2x"/> : (Object.entries(book).length > 0) ?
            (<> 
                <div className="reviewContent">
                    <h3>Write Your Review</h3>
                    {messsage ? <p className="successMessage">{messsage}</p> : ''}
                    <form onSubmit={submitReview}>
                                    <div className="contentRow">
                                        <label className="contentLabel">Book Name</label>
                                        <div className="reviewContentValue">
                                            <label className="reviewContentValue capitalize">{book.title}</label>
                                        </div>
                                    </div>
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
                                        <div className="reviewContentValue">
                                        {bookUserId == user._id ? <textarea value={content} onChange={(e) => setContent(e.target.value)} readOnly = {bookUserId != user._id}placeholder="Write what you think about this book"/> : <label className="reviewContentValue reviewComment">{content ? content:'Comment not added yet.'}</label>}
                                        </div>
                                    </div>
                                    {bookUserId == user._id && <div className="contentRow">
                                        <button type="submit">Submit</button>
                                    </div>}
                                </form>
                </div>
            </>):(<p>Error in fetching book details</p>)}    
        </div>
    </>;
}

export default Review;