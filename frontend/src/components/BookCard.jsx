import React, { useState } from "react";
import "./BookCard.css";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateProgress } from "../store/actions/dashboardActions";
import { Link } from "react-router-dom";

export const BookCard = ({ book, tag, currentProgress, section, bookuser }) => {
    const [updateProgressFlag, setUpdateProgressFlag] = useState(false);
    const [progress, setProgress] = useState('');
    const [updated, setUpdated] = useState(false);
    const { user } = useAuth();
    let userId = bookuser ? bookuser._id : user._id;
    const dispatch = useDispatch();
    let { bookProgress, progressBookId, updatedTag } = useSelector(state => state.dashboard);
    if (updatedTag != '' && progressBookId == book._id) {
        tag = updatedTag;
    }
    let finalProgress = '';
    if (book._id === progressBookId) {
        finalProgress = bookProgress;
    } else {
        finalProgress = currentProgress;
    }

    const updateBookProgress = async () => {
        let headers = { 'Content-type': 'application/json' };
        let userData = { userId: user._id, bookId: book._id, progress: progress };
        let response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/updateprogress', userData, headers);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            dispatch(updateProgress(response.data.progress, book._id, response.data.tag));
            setUpdateProgressFlag(false);
        }
    }
    return (
        <>
        {section=='CurrentlyReading' && tag == 'completed' ? '' : <div className="bookCard">
            <img src={book?.imageLinks.smallThumbnail} alt={book.title} />
            <div className="details">
                <h3><Link to={`${process.env.REACT_APP_BASE_URL}/book/${book._id}`}>{book?.title}</Link></h3>
                <p>By: <b>{book?.authors}</b></p>
                {section === 'SocialCard' && <button type="button"><Link className="review" to={`${process.env.REACT_APP_BASE_URL}/review/${book._id}/${userId}`}>Review</Link></button>}
                {tag == 'currently-reading' ? 
                <>
                    {finalProgress ? (<p>{finalProgress} %</p>) : ''}
                    {updateProgressFlag ? 
                        <div className="updateProgress">
                            <input type="number" min="0" value={progress} onChange={(e) => setProgress(e.target.value)} placeholder="Update Progress(%)" />
                            <button type="button" onClick={updateBookProgress}>Update</button>
                        </div> : <button type="button" onClick={() => setUpdateProgressFlag(true)}>Update Progress</button>
                    }
                </>:''}
            </div>
        </div>}
        </>
    )
}