import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { BookCard } from "./BookCard";
import { useDispatch } from "react-redux";
import { resetProgress } from "../store/actions/dashboardActions";

const CurrentlyReading = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [currentlyReading, setCurrentlyReading] = useState([]);
    const dispatch = useDispatch();
    const fetchCurrentlyReadingBooks = async () => {
        let headers = { 'Content-type': 'application/json' };
        let userData = { userId: user._id };
        let response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/currentlyreadingbooks', userData, headers);
        console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            let currentlyReadingBooks = response.data.books;
            //console.log('currentlyReadingBooks:', currentlyReadingBooks);
            setCurrentlyReading(response.data.books);
            console.log('currentlyReading.length:', currentlyReading.length);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCurrentlyReadingBooks();
        dispatch(resetProgress());
    }, []);
    //console.log('currentlyReading:', currentlyReading);
    return (
        <div id="currentlyReading">
            {loading ?
                <div>Loading...</div> :
                <div id="currentlReadingBooks">
                    <h2>Currently Reading</h2>
                    {
                        currentlyReading.length > 0 ?
                            <>
                                {currentlyReading?.map(currentBook => {
                                    let book = currentBook.bookId;
                                    console.log('currentBook:', currentBook);
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