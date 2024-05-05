import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { updateRating, addBook, updateTag } from "../store/actions/reviewActions";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const headers = {
    'Content-Type': 'application/json'
}

export const BookItem = ({ book, source, search }) => {
    const { user } = useAuth();
    console.log('book:', book);
    let finalRating = '';
    let finalAvgRating = '';
    let updatedTag = '';
    let {newBook, rating, bookShelfExternalIds, bookId, avgRating, tag} = useSelector(state => state.review);
    if (rating != '' && bookId == book.id && avgRating != '') {
        finalRating = rating;
        finalAvgRating = avgRating;
        console.log('updated rating:', rating);
        console.log('updated avgRating:', avgRating);
    } else {
        finalRating = finalAvgRating = book.avgRating;
        console.log('existing rating:', finalRating, 'book:', book.title);
    }

    if (tag != '' && bookId == book.id) {
        updatedTag = tag;
        console.log('updated tag:', updatedTag);
    } else {
        updatedTag = book.tag;
    }
    const dispatch = useDispatch();
    let bookDetails = {
        title: book.title,
        authors: book.authors,
        externalId: book.externalId,
        imageLinks: book.imageLinks,
        userId: user._id
    };

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
        const response = await axios.post('https://book-shelf-xvxk.onrender.com/api/startReading', {bookId: bookId, userId: user._id, tag: 'currently-reading'}, headers);
        console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data !== "undefined" && typeof response.data.updatedTag !== "undefined" && typeof response.data.updatedTag !== "") {
            console.log('read response:', response);
            let tag = response.data.updatedTag.tag;
            let bookId = response.data.updatedTag.bookId;
            dispatch(updateTag(tag, bookId));
        }        
    } 

    const addToBookShelf = async (bookDetails) => {
        const response = await axios.post('https://book-shelf-xvxk.onrender.com/api/addBookToShelf', bookDetails, headers);
        console.log('response:', response);
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
                <div>{updatedTag}</div>
            </>
        ) : ''}
            <div>
                {search ? ((Object.keys(newBook).length > 0 && newBook.externalId === book.externalId) || (bookShelfExternalIds.includes(book.externalId)) ? <button type="button"><span>&#43;</span> View</button> : <button type="button" onClick={() => addToBookShelf(bookDetails)}><span>&#43;</span> Add To BookShelf</button>)
                        : updatedTag === 'to-read' ? <><button type="button" onClick={()=>startReading(book.id)} title="Mark as Currently Reading">Start Reading</button><button type="button"><span>&#43;</span> View </button></>: <button type="button"><span>&#43;</span> View </button>}
            </div>
        </div>
    );

}