import React, { useState } from "react";
import "./BookCard.css";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateProgress } from "../store/actions/dashboardActions";

export const BookCard = ({book, tag, currentProgress}) => {
    const [updateProgressFlag, setUpdateProgressFlag] = useState(false);
    const [progress, setProgress] = useState('');
    const [updated, setUpdated] = useState(false);
    const {user} = useAuth();
    const dispatch = useDispatch();
    let {bookProgress, progressBookId} = useSelector(state => state.dashboard);
    let finalProgress = '';
    if (book._id === progressBookId) {
        finalProgress = bookProgress;
    } else {
        finalProgress = currentProgress;
    }
    //console.log(`bookProgress for ${book.title} is ${finalProgress}`);
    console.log(`currentProgress:`, currentProgress);
    
    const updateBookProgress = async () => {
        let headers = { 'Content-type': 'application/json' };
        let userData = { userId: user._id, bookId: book._id, progress: progress };
        let response = await axios.post('http://localhost:5000/api/updateProgress', userData, headers);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            dispatch(updateProgress(response.data, book._id));
            setUpdateProgressFlag(false);
        }
    }
    return (
        <div className="bookCard">
            <img src={book?.imageLinks.smallThumbnail} alt={book.title} />
            <div className="details">
                <h3>{book?.title}</h3>
                <p>By: {book?.authors}</p>
                {tag === 'currently-reading' && (
                    <>
                        { finalProgress ? (<p> On Page {finalProgress}</p>) : ''}
                        { updateProgressFlag ? <div className="updateProgress"><input type="number" min="0" value={progress} onChange={(e) => setProgress(e.target.value)} placeholder="Update Page Number" /><button type="button" onClick={updateBookProgress}>Update</button></div> : <button type="button" onClick={() => setUpdateProgressFlag(true)}>Update Progress</button>}
                    </>
                )}                    
            </div>
        </div>
    )
}