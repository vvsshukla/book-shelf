import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SearchBooks.css";
import { BookShelfTable } from "./BookShelfTable";
import { useAuth } from "../hooks/useAuth";

export const SearchBooks = () => {
    const apiKey = 'AIzaSyDWMI2ifsQqe5Os9ZTu5IgR4ZULcwcFCBM';
    const [search, setSearch] = useState('');
    const [searchedBooks, setSearchedBooks] = useState([]);
    const [existingBooks, setExistingBooks] = useState([]);
    const {user} = useAuth();

    const searchBook = async (evt) => {
        if (evt.key === 'Enter') {
            try {
                let response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}&key=${apiKey}`);
                console.log('response:', response);
                if (typeof response !== "undefined" && typeof response.data !== "undefined" && typeof response.data.items !== "undefined") {
                    let shelfBooks = response.data.items;
                    let bookArray = [];
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
                            bookArray.push(bookDetails);
                        }
                    }
                    console.log('result:', bookArray);
                    setSearchedBooks(bookArray);
                }
                console.log('result:', response);
            } catch (error) {
                console.log('Error:', error);
            }
        }
    }

    const fetchBooks = async () => {
        let headers = { 'Content-type': 'application/json' };
        //console.log('user:', user);
        let userData = {userId: user._id};
        console.log('userDate:', userData);
        let response = await axios.post('http://localhost:5000/api/books', userData, headers);
        console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            let shelfBooks = response.data.books;
            console.log('books:', shelfBooks);
            let bookArray = [];
            for (const book of shelfBooks) {
                let thumbnail = book.imageLinks.thumbnail;
                let smallThumbnail = book.imageLinks.smallThumbnail;
                if (thumbnail !== undefined && smallThumbnail !== undefined) {
                    let bookDetails = {
                        id:book._id,
                        title: book.title,
                        authors: book.authors,
                        externalId: book.id,
                        smallThumbnail: book.imageLinks.smallThumbnail,
                        avgRating:book.avgRating,
                        tag: book.tag
                    };
                    bookArray.push(bookDetails);
                }
            }
            console.log('bookArray:', bookArray);
            setExistingBooks(bookArray);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);
    return (
        <div id="searchBooksDiv">
            <div className="search-form">
                <input type="text" id="search-books" placeholder="Enter Your Book Name" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={searchBook} />
                <button type="button" onClick={searchBook}>&#128269;</button>
            </div>
            {
                search !== '' ? (searchedBooks.length > 0 ?
                    <BookShelfTable shelfBooks={searchedBooks} source='external'/> : 'No record found.') : (existingBooks.length > 0 ? <BookShelfTable shelfBooks={existingBooks} source="internal"/> : <p>Add book to shelf</p>)
            }
        </div>
    )
}