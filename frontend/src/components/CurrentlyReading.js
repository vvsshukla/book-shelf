import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { BookCard } from "./BookCard";

const CurrentlyReading = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [currentlyReading, setCurrentlyReading] = useState([]);
    const fetchCurrentlyReadingBooks = async () => {
        let headers = { 'Content-type': 'application/json' };
        let userData = { userId: user._id };
        let response = await axios.post('https://book-shelf-xvxk.onrender.com/api/currentlyreadingbooks', userData, headers);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            let currentlyReadingBooks = response.data.books;
            //console.log('currentlyReadingBooks:', currentlyReadingBooks);
            setCurrentlyReading(response.data.books);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCurrentlyReadingBooks();
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
                                    return <BookCard book={book} key={book?._id} tag={currentBook.tag} currentProgress={currentBook.progress}/>;
                                })}
                            </>
                            : <div>You are not reading any book currently.</div>
                    }
                </div>
            }
        </div>
    );
}

export default CurrentlyReading;