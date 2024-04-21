import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { updateRating, addBook } from "../store/actions/reviewActions";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";


export const BookItem = ({ book, source, search }) => {
    const { user } = useAuth();
    const { newBook, rating, bookShelfExternalIds} = useSelector(state => state.review);
    // console.log('newbook:', newBook);
    // console.log('newbook.externalId:', newBook.externalId);
    console.log('bookShelfExternalIds:', bookShelfExternalIds);
    const dispatch = useDispatch();
    let bookDetails = {
        title: book.title,
        authors: book.authors,
        externalId: book.externalId,
        imageLinks: book.imageLinks,
        userId: user._id
    };
    //console.log('bookdetails:', bookDetails);

    const handleRating = (rating) => {
        console.log('rate:', rating);
        dispatch(updateRating(rating));
    }

    const addToBookShelf = async (bookDetails) => {
        // console.log('addToBookShelf');
        // console.log('bookDetails:', bookDetails);
        const headers = {
            'Content-Type': 'application/json'
        }
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
                        initialValue={rating}
                        size={18}
                        transition
                        fillColor="gold"
                        emptyColor="lightgray"
                        onClick={handleRating}
                    />({book.avgRating})
                </div>
                <div>{book.tag}</div>
            </>
        ) : ''}
            <div>{search ? ((Object.keys(newBook).length > 0 && newBook.externalId === book.externalId) || (bookShelfExternalIds.includes(book.externalId)) ? <button type="button"><span>&#43;</span> View</button> : <button type="button" onClick={() => addToBookShelf(bookDetails)}><span>&#43;</span> Add To BookShelf</button>) : <button type="button"><span>&#43;</span> View </button>}</div>
        </div>
    );

}

/* {typeof book.id !== "undefined" ? (<button type="button"><span>&#43;</span> View</button>) : (Object.keys(newBook).length > 0 ? <button type="button"><span>&#43;</span> View</button> : <button type="button" onClick={() => addToBookShelf(bookDetails)}><span>&#43;</span> Add To BookShelf</button>)}*/