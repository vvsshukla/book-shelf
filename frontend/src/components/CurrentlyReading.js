import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { BookCard } from "./BookCard";
import { useDispatch } from "react-redux";
import { resetProgress } from "../store/actions/dashboardActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const CurrentlyReading = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [currentlyReading, setCurrentlyReading] = useState([]);
    const dispatch = useDispatch();
    const fetchCurrentlyReadingBooks = async () => {
        let headers = { 'Content-type': 'application/json' };
        let userData = { userId: user._id };
        let response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/currentlyreadingbooks', userData, headers);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            let currentlyReadingBooks = response.data.books;
            setCurrentlyReading(response.data.books);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCurrentlyReadingBooks();
        dispatch(resetProgress());
    }, []);
    return (
        <div id="currentlyReading">
            {loading ?
                <div className="loaderDiv"><FontAwesomeIcon icon={faSpinner} spin size="2x"/></div>:
                <div id="currentlReadingBooks">
                    <h3 className="dashboardHeadings">Currently Reading</h3>
                    {
                        currentlyReading.length > 0 ?
                            <>
                                {currentlyReading?.map(currentBook => {
                                    let book = currentBook.bookId;
                                    return <BookCard book={book} key={book?._id} tag={currentBook.tag} currentProgress={currentBook.progress} section={'CurrentlyReading'} />;
                                })}
                            </>
                            : <div className="fallBackMsg">You are not reading any book currently.</div>
                    }
                </div>
            }
        </div>
    );
}

export default CurrentlyReading;