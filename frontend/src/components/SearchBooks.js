import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SearchBooks.css";
import { BookShelfTable } from "./BookShelfTable";

export const SearchBooks = () => {
    const apiKey = 'AIzaSyDWMI2ifsQqe5Os9ZTu5IgR4ZULcwcFCBM';
    const [search, setSearch] = useState('');
    const [searchedBooks, setSearchedBooks] = useState([]);
    const [newBook, setNewBook] = useState({});
    const [existingBooks, setExistingBooks] = useState([]);

    const searchBook = async (evt) => {
        if (evt.key === 'Enter') {
            try {
                let response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}&key=${apiKey}`);
                if (typeof response !== "undefined" && typeof response.data !== "undefined" && typeof response.data.items !== "undefined") {
                    setSearchedBooks(response.data.items);
                }
                console.log('result:', response);
            } catch (error) {
                console.log('Error:', error);
            }
        }
    }

    const fetchBooks = async () => {
        let headers = { 'Content-type': 'application/json' };
        let response = await axios.post('http://localhost:5000/api/books', {}, headers);
        console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            setExistingBooks(response.data.books);
            console.log('existingBooks:', existingBooks);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    const addToBookShelf = async ({ bookDetails }) => {
        const headers = {
            'Content-Type': 'application/json'
        }
        console.log('bookDetails:', bookDetails);
        const response = await axios.post('http://localhost:5000/api/addBookToShelf', bookDetails, headers);
        console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data !== "undefined" && typeof response.data.newBook !== "undefined") {
            console.log('Book added successfully.');
            setNewBook(response.data.newBook);
        }
    }
    return (
        <div id="searchBooksDiv">
            <div className="search-form">
                <input type="text" id="search-books" placeholder="Enter Your Book Name" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={searchBook} />
                <button type="button" onClick={searchBook}>&#128269;</button>
            </div>
            {
                search != '' ? (searchedBooks.length > 0 ?
                    <BookShelfTable shelfBooks={searchedBooks} /> : 'No record found.') : (existingBooks.length > 0 ? <BookShelfTable shelfBooks={existingBooks} /> : <p>Add book to shelf</p>)
            }
        </div>
    )
}