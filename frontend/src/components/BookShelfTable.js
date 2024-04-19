import React, { useState } from "react";
import "./BookShelfTable.css";
import axios from "axios";


export const BookShelfTable = ({ shelfBooks }) => {
    const [newBook, setNewBook] = useState({});
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
        <div id="searchResult">
            <div id="table">
                <div id="thead">
                    <div id="thTr" key={"existingBooksHeader"}>
                        <div>
                            Cover
                        </div>
                        <div>
                            Title
                        </div>
                        <div>
                            Author
                        </div>
                        <div>
                            Action
                        </div>
                    </div>
                </div>
                <div id="tbody">
                    {shelfBooks?.map((book) => {
                        let thumbnail = book?.imageLinks?.thumbnail;
                        let smallThumbnail = book?.imageLinks?.smallThumbnail;
                        console.log('book:', book);
                        if (thumbnail !== undefined && smallThumbnail !== undefined) {
                            let bookDetails = {
                                title: book?.title,
                                authors: book?.authors,
                                externalId: book.id,
                                imageLinks: book?.imageLinks
                            };
                            console.log('bookDetails:', bookDetails);
                            return (
                                <div id="tbodyTr" key={book.id}>
                                    <div><img src={thumbnail} alt={book.title} /></div>
                                    <div>{book.title}</div>
                                    <div>{book.authors}</div>
                                    <div><button type="button" onClick={() => addToBookShelf({ bookDetails })}><span>&#43;</span> View</button></div>
                                </div>
                            )
                        }
                        return <><tr>No record found.</tr></>
                    })}
                </div>
            </div>
        </div>
    );
}