import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Header } from "./Header";
import BookShelf from "./BookShelf";
import Library from "./Library";
import { updateRating, updateTag, resetReview, addBook, getExistingBooks,setViewBookId} from "../store/actions/reviewActions";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faBookReader } from "@fortawesome/free-solid-svg-icons";
import { Rating } from "react-simple-star-rating";
import "./Friends.css";
import "./BookShelf.css";
import { Link } from "react-router-dom";

const tabItems = [
    {
        id: 1,
        title: 'BookShelf'
    },
    {
        id: 2,
        title: 'Library'
    }
]

const TabItemComponent = ({ title, onItemClicked = () => console.error('You passed no action to the component.'), isActive = false }) => {
    return (
        <div className={isActive ? 'tabItem' : 'tabItem tabItemInactive'} onClick={onItemClicked}>
            <p className="tabItemTitle">{title}</p>
        </div>
    )
}

let headers = { 'Content-type': 'application/json' };

const MyBookShelf = () => {
    const apiKey = 'AIzaSyDWMI2ifsQqe5Os9ZTu5IgR4ZULcwcFCBM';
    const [search, setSearch] = useState('');
    const [searchedBooks, setSearchedBooks] = useState([]);
    const [existingBooks, setExistingBooks] = useState([]);
    const [active, setActive] = useState(1);
    const [activeTab, setActiveTab] = useState(1);
    const [loader, setLoader] = useState(1);
    const [message, setMessage] = useState('');
    const { user } = useAuth();
    const dispatch = useDispatch();

    let { newBook, rating, bookShelfExternalIds, bookId, avgRating, tag } = useSelector(state => state.review);

    const searchBook = async (evt, serachText) => {
        if (evt.key === 'Enter' || evt.type === 'click') {
            try {
                let searchText = '';
                if (evt.key === 'Enter') {
                    searchText = evt.target.value;
                } else {
                    searchText = document.getElementById('search-books').value;
                }
                console.log('serachText:', serachText);
                let response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchText}&key=${apiKey}`);
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
                                imageLinks: book.volumeInfo?.imageLinks,
                                description: book.volumeInfo?.description,
                                language: book.volumeInfo?.language,
                                pageCount: book.volumeInfo?.pageCount,
                                publishedDate: book.volumeInfo?.publishedDate,
                                categories: book.volumeInfo?.categories,
                                subTitle: book.volumeInfo?.subtitle,
                                maturityRating: book.volumeInfo?.maturityRating
                            };
                            searchedbookArray.push(bookDetails);
                        }
                    }
                    console.log('result:', searchedbookArray);
                    setSearchedBooks(searchedbookArray);
                } else {
                    setSearch(evt.target.value);
                }
            } catch (error) {
                console.log('Error:', error);
            }
        }
    }

    const fetchBooks = async () => {
        let headers = { 'Content-type': 'application/json' };
        let userData = { userId: user._id };
        let response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/books', userData, headers);
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
                        id: bookObject._id,
                        title: bookObject.title,
                        authors: bookObject.authors,
                        externalId: bookObject.externalId,
                        smallThumbnail: bookObject.imageLinks.smallThumbnail,
                        avgRating: bookObject.avgRating,
                        tag: book.tag
                    };
                    existingBookArray.push(bookDetails);
                }
            }
            console.log('existingBookArray:', existingBookArray);
            setExistingBooks(existingBookArray);
            dispatch(getExistingBooks(existingBookArray));
            setLoader(0);
        }
    }

    useEffect(() => {
        dispatch(resetReview());
        fetchBooks();
    }, []);

    const startReading = async (bookId) => {
        const response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/startreading', { bookId: bookId, userId: user._id, tag: 'currently-reading' }, headers);
        console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data !== "undefined" && typeof response.data.updatedTag !== "undefined" && typeof response.data.updatedTag !== "") {
            console.log('read response:', response);
            let tag = response.data.updatedTag.tag;
            let bookId = response.data.updatedTag.bookId;
            dispatch(updateTag(tag, bookId));
        }
    }

    const renderBookShelf = ({ rating: propRating, bookId, avgRating: propAvgRating, tag }) => {
        let dataSource = [];
        existingBooks.forEach(book => {
            let finalRating = '';
            let finalAvgRating = '';
            let updatedTag = '';
            if (tag != '' && bookId == book.id) {
                updatedTag = tag;
                console.log('updated tag:', updatedTag);
            } else {
                updatedTag = book.tag;
            }
            console.log('updated avgRating:', propAvgRating);
            if (propRating != '' && bookId == book.id && propAvgRating != '') {
                finalRating = propRating;
                finalAvgRating = propAvgRating;
                console.log('updated rating:', propRating);
                console.log('updated avgRating:', propAvgRating);
            } else {
                finalRating = finalAvgRating = book.avgRating;
                console.log('existing rating:', finalRating, 'book:', book.title);
            }
            let cover = <img src={book.smallThumbnail} alt={book.title} />;
            let title = book.title;
            let authors = book.authors;
            let shelves = updatedTag;
            const handleRating = async (rate) => {
                let data = {
                    rating: rate,
                    userId: user._id,
                    bookId: book.id
                }
                console.log(data);
                const response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/updaterating', data, headers);
                console.log('response:', response);
                if (typeof response !== "undefined" && typeof response.data !== "undefined" && typeof response.data.review !== "undefined" && typeof response.data.review.avgRating !== "undefined") {
                    console.log('Rating updated successfully.');
                    dispatch(updateRating(response.data.review.rating, response.data.review.avgRating, book.id));
                }
            }
            let avgRating = (
                <>
                    <Rating
                        initialValue={finalRating}
                        size={18}
                        transition
                        fillColor="gold"
                        emptyColor="lightgray"
                        onClick={handleRating}
                        bookId={book.id}
                    />
                    ({finalAvgRating})
                </>
            );
            let action;
            switch(updatedTag){
                case 'to-read':
                    action = (
                        <div className="actionBtns">
                            <button type="button" className="read-button" onClick={() => startReading(book.id)} title="Mark as Currently Reading"><FontAwesomeIcon icon={faBookReader} size="1x"/>Read</button>
                            <Link to={`/book/${book.id}`} className="view-button"><span>&#128065;</span>View</Link>
                        </div>
                    );
                    break;
                case 'currently-reading':
                    action = <div className="actionBtns">
                        {/* <button type="button" className="view-button"><span>&#128065;</span>View</button> */}
                        <Link to={`/book/${book.id}`} className="view-button" onClick={() => dispatch(setViewBookId(book.id))}><span>&#128065;</span>View</Link>
                        </div>;
                    break;
                case 'completed':
                    action = <div className="actionBtns">
                                <Link to={`/book/${book.id}`} className="view-button" onClick={() => dispatch(setViewBookId(book.id))}><span>&#128065;</span>View</Link>
                                <Link to={`/review/${book.id}`} className="review-button"><span>&#9733;</span>Review</Link>
                            </div>;   
                    break;
            }
            console.log('action:', action);
            dataSource.push({ cover: cover, title: title, author: authors, shelves: shelves, avgRating: avgRating, action: action });
        });
        console.log('existingBooks.length:', existingBooks.length);
        return <>
            <div id="bookShelfResults">
                {existingBooks.length > 0 ? <BookShelf dataSource={dataSource} /> : <span className="infoMessage">BookShelf is empty.</span>}
            </div>
        </>;
    }

    const renderLibrary = () => {
        let dataSource = [];
        searchedBooks.forEach(book => {
            let cover = <img src={book.smallThumbnail} alt={book.title} />;
            let title = book.title;
            let authors = book.authors;
            let bookDetails = {
                title: book.title,
                authors: book.authors,
                externalId: book.externalId,
                imageLinks: book.imageLinks,
                userId: user._id,
                description: book.description,
                subTitle: book.subTitle,
                language: book.language,
                pageCount: book.pageCount,
                categories: book.categories,
                maturityRating: book.maturityRating,
                publishedDate: book.publishedDate
            };
            const addToBookShelf = async (bookDetails) => {
                console.log('bookDetails:', bookDetails);
                const response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/addbooktoshelf', bookDetails, headers);
                console.log('response:', response);
                if (typeof response !== "undefined" && typeof response.data !== "undefined" && typeof response.data.newBook !== "undefined") {
                    console.log('Book added successfully.');
                    dispatch(addBook(response.data.newBook));
                }
            }
            let action = (Object.keys(newBook).length > 0 && newBook.externalId === book.externalId) || (bookShelfExternalIds.includes(book.externalId)) ? <button type="button"><span>&#43;</span> View</button> : <button type="button" onClick={() => addToBookShelf(bookDetails)}><span>&#43;</span> Add To BookShelf</button>;
            dataSource.push({ cover: cover, title: title, author: authors, action: action });
        });
        console.log('searchedBooks.length:', searchedBooks.length);
        return <>
            <div id="searchBooksDiv">
                <div className="search-form">
                    <input type="text" id="search-books" placeholder="Search Library By Book Name" onKeyDown={searchBook} />
                    <button type="button" onClick={searchBook}>&#128269;</button>
                </div>
                {searchedBooks.length > 0 ? <Library dataSource={dataSource} /> : (search !== "" ? <span className="infoMessage">No record found.</span> : '')}
            </div>
        </>;
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 1:
                return renderBookShelf({ rating, bookId, avgRating, tag });
            case 2:
                return renderLibrary();
            default:
                return;
        }
    }

    const populateTabContent = (tabId) => {
        if (tabId === 1) {
            setLoader(1);
        }
        console.log('populateTabContent:', tabId);
        switch (tabId) {
            case 1:
                console.log('populateTabContent fetchBooks');
                fetchBooks();
                break;
            case 2:
                console.log('populateTabContent searchFriends');
            default:
        }
    }

    return <>
        <Header />
        <div id="friendsDiv">
            <div className="wrapper">
                <div className="tabs">
                    {tabItems?.map(({ id, title }) =>
                        <TabItemComponent
                            key={title}
                            title={title}
                            onItemClicked={() => { setActive(id); setActiveTab(id); populateTabContent(id); }}
                            isActive={active === id}
                        />)}
                </div>
                <div className="content">
                    {loader == 1 ? <FontAwesomeIcon icon={faSpinner} size="2x" spin color="gray" /> : renderTabContent()}
                </div>
            </div>
        </div>
    </>;
}

export default MyBookShelf;