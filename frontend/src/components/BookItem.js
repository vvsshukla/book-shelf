import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { updateRating, addBook, startReading } from "../store/actions/reviewActions";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const headers = {
    'Content-Type': 'application/json'
}

export const BookItem = ({ book, source, search }) => {
    const { user } = useAuth();
    //const [averageRating, setAverageRating] = useState(book.avgRating);
    let finalRating = '';
    let finalAvgRating = '';
    let { newBook, rating, bookShelfExternalIds, bookId, avgRating} = useSelector(state => state.review);
    if (rating != '' && bookId == book.id && avgRating != '') {
        finalRating = rating;
        finalAvgRating = avgRating;
        console.log('updated rating:', rating);
        console.log('updated avgRating:', avgRating);
        //setAverageRating(avgRating);
    } else {
        finalRating = finalAvgRating = book.avgRating;
        console.log('existing rating:', finalRating, 'book:', book.title);
    }
    //console.log('bookShelfExternalIds:', bookShelfExternalIds);
    const dispatch = useDispatch();
    let bookDetails = {
        title: book.title,
        authors: book.authors,
        externalId: book.externalId,
        imageLinks: book.imageLinks,
        userId: user._id
    };
    //console.log('bookdetails:', bookDetails);

    const handleRating = async (rating) => {
        let data = {
            rating: rating,
            userId: user._id,
            bookId: book.id
        }
        const response = await axios.post('https://book-shelf-xvxk.onrender.com/api/updateRating', data, headers);
        console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data !== "undefined" && typeof response.data.review !== "undefined" && typeof response.data.review.avgRating!=="undefined") {
            console.log('Rating updated successfully.');
            dispatch(updateRating(response.data.review.rating, response.data.review.avgRating, book.id));
        }
    }

    const startReading = async (bookId) => {
        const response = await axios.post('http://localhost:5000/api/startReading', {bookId: bookId}, headers);
        if (typeof response !== "undefined" && typeof response.data !== "undefined" && typeof response.data.tag !== "undefined") {
            console.log('read response:', response);
            dispatch(startReading(response.data.tag));
        }        
    } 

    const addToBookShelf = async (bookDetails) => {
        // console.log('addToBookShelf');
        // console.log('bookDetails:', bookDetails);
        const response = await axios.post('http://localhost:5000/api/addBookToShelf', bookDetails, headers);
        //console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data !== "undefined" && typeof response.data.newBook !== "undefined") {
            console.log('Book added successfully.');
            dispatch(addBook(response.data.newBook));
        }
    }
    return (
        <div id="tbodyTr">
            <div><img src={book.smallThumbnail} alt={book.title} /></div>
            <div>{book.title}</div>
            <div>{book.authors}</div>
            {source === 'internal' ? (
            <>
                <div>
                    <Rating
                        initialValue={finalRating}
                        size={18}
                        transition
                        fillColor="gold"
                        emptyColor="lightgray"
                        onClick={handleRating}
                    />({finalAvgRating})
                </div>
                <div>{book.tag}</div>
            </>
        ) : ''}
            <div>
                {search ? ((Object.keys(newBook).length > 0 && newBook.externalId === book.externalId) || (bookShelfExternalIds.includes(book.externalId)) ? <button type="button"><span>&#43;</span> View</button> : <button type="button" onClick={() => addToBookShelf(bookDetails)}><span>&#43;</span> Add To BookShelf</button>) : <button type="button"><span>&#43;</span> View </button>}
                {book.tag === 'to-read' ? <button type="button" onClick={()=>startReading(book.id)} title="Mark as Currently Reading">Start Reading</button> : ''}    
            </div>
        </div>
    );

}

/* {typeof book.id !== "undefined" ? (<button type="button"><span>&#43;</span> View</button>) : (Object.keys(newBook).length > 0 ? <button type="button"><span>&#43;</span> View</button> : <button type="button" onClick={() => addToBookShelf(bookDetails)}><span>&#43;</span> Add To BookShelf</button>)}*/