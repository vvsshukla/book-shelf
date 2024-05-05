import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SearchBooks.css";
import { BookShelfTable } from "./BookShelfTable";
import { useAuth } from "../hooks/useAuth";
import { getExistingBooks } from "../store/actions/reviewActions";
import { useDispatch } from "react-redux";

export const SearchBooks = () => {
    const apiKey = 'AIzaSyDWMI2ifsQqe5Os9ZTu5IgR4ZULcwcFCBM';
    const [search, setSearch] = useState('');
    const [searchedBooks, setSearchedBooks] = useState([]);
    const [existingBooks, setExistingBooks] = useState([]);
    const {user} = useAuth();
    const dispatch = useDispatch();

    const searchBook = async (evt) => {
        if (evt.key === 'Enter' || evt.type === 'click') {
            try {
                let response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}&key=${apiKey}`);
                console.log('response:', response);
                if (typeof response !== "undefined" && typeof response.data !== "undefined" && typeof response.data.items !== "undefined") {
                    let shelfBooks = response.data.items;
                    let searchedbookArray = [];
                    for (const book of shelfBooks) {
                        let thumbnail = book?.volumeInfo?.imageLinks?.thumbnail;
                        let smallThumbnail = book?.volumeInfo?.imageLinks?.smallThumbnail;
                        if (thumbnail !== undefined && smallThumbnail !== undefined) {
                            let bookDetails = {
                                title: book.volumeInfo?.title,
                                authors: book.volumeInfo?.authors,
                                externalId: book.id,
                                smallThumbnail: smallThumbnail,
                                imageLinks: book.volumeInfo?.imageLinks
                            };
                            searchedbookArray.push(bookDetails);
                        }
                    }
                    console.log('result:', searchedbookArray);
                    setSearchedBooks(searchedbookArray);
                }
            } catch (error) {
                console.log('Error:', error);
            }
        }
    }

    const fetchBooks = async () => {
        let headers = { 'Content-type': 'application/json' };
        let userData = {userId: user._id};
        let response = await axios.post('http://book-shelf-xvxk.onrender.com/api/books', userData, headers);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            let shelfBooks = response.data.books;
            console.log('fetchBooks:', shelfBooks);
            let existingBookArray = [];
            for (const book of shelfBooks) {
                let bookObject = book.bookId;
                let thumbnail = bookObject.imageLinks.thumbnail;
                let smallThumbnail = bookObject.imageLinks.smallThumbnail;
                if (thumbnail !== undefined && smallThumbnail !== undefined) {
                    let bookDetails = {
                        id:bookObject._id,
                        title: bookObject.title,
                        authors: bookObject.authors,
                        externalId: bookObject.externalId,
                        smallThumbnail: bookObject.imageLinks.smallThumbnail,
                        avgRating:bookObject.avgRating,
                        tag: book.tag
                    };
                    existingBookArray.push(bookDetails);
                }
            }
            console.log('existingBookArray:', existingBookArray);
            setExistingBooks(existingBookArray);
            dispatch(getExistingBooks(existingBookArray));
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);
    return (
        <div id="searchBooksDiv">
            <div className="search-form">
                <input type="text" id="search-books" placeholder="Search Library By Book Name" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={searchBook} />
                <button type="button" onClick={searchBook}>&#128269;</button>
            </div>
            {
                search !== '' ? (searchedBooks.length > 0 ?
                    <BookShelfTable shelfBooks={searchedBooks} source='external' search={search}/> : 'No record found.') : (existingBooks.length > 0 ? <BookShelfTable shelfBooks={existingBooks} source="internal"/> : <p>Add book to shelf</p>)
            }
        </div>
    )
}