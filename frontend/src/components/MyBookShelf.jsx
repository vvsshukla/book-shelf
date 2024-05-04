import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Header } from "./Header";
import BookShelf from "./BookShelf";
import { getExistingBooks } from "../store/actions/reviewActions";
import { updateRating, updateTag, resetReview } from "../store/actions/reviewActions";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Rating } from "react-simple-star-rating";
import "./Friends.css";
import "./BookShelf.css";

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
    const [existingBooks, setExistingBooks] = useState([]);
    const [active, setActive] = useState(1);
    const [activeTab, setActiveTab] = useState(1);
    const [loader, setLoader] = useState(1);
    const [message, setMessage] = useState('');
    const {user} = useAuth();
    const dispatch = useDispatch();

    let {rating, bookId, avgRating, tag} = useSelector(state => state.review);

    const fetchBooks = async () => {
        let headers = { 'Content-type': 'application/json' };
        let userData = { userId: user._id };
        let response = await axios.post('http://localhost:5000/api/books', userData, headers);
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
            setLoader(0);
            //dispatch(getExistingBooks(existingBookArray));
        }
    }

    useEffect(() => {
        dispatch(resetReview());
        fetchBooks();
    }, []);

    const startReading = async (bookId) => {
        const response = await axios.post('http://localhost:5000/api/startReading', {bookId: bookId, userId: user._id, tag: 'currently-reading'}, headers);
        console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data !== "undefined" && typeof response.data.updatedTag !== "undefined" && typeof response.data.updatedTag !== "") {
            console.log('read response:', response);
            let tag = response.data.updatedTag.tag;
            let bookId = response.data.updatedTag.bookId;
            dispatch(updateTag(tag, bookId));
        }        
    }

    const populateTabContent = (tabId) => {
        
    }

    const renderBookShelf = ({rating, bookId, avgRating: propAvgRating, tag}) => {
        let dataSource = [];
        
        const handleRating = async (rating, bookId) => {
            console.log(rating, bookId);
            let data = {
                rating: rating,
                userId: user._id,
                bookId: bookId
            }
            const response = await axios.post('http://localhost:5000/api/updateRating', data, headers);
            console.log('response:', response);
            if (typeof response !== "undefined" && typeof response.data !== "undefined" && typeof response.data.review !== "undefined" && typeof response.data.review.avgRating!=="undefined") {
                console.log('Rating updated successfully.');
                dispatch(updateRating(response.data.review.rating, response.data.review.avgRating, bookId));
            }
        }
        
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
            if (rating != '' && bookId == book.id && propAvgRating != '') {
                finalRating = rating;
                finalAvgRating = propAvgRating;
                console.log('updated rating:', rating);
                console.log('updated avgRating:', propAvgRating);
            } else {
                finalRating = finalAvgRating = book.avgRating;
                console.log('existing rating:', finalRating, 'book:', book.title);
            }
            let cover = <img src={book.smallThumbnail} alt={book.title} />;
            let title = book.title;
            let authors = book.authors;
            let shelves = updatedTag;
            let avgRating = (
                <>
                    <Rating
                        initialValue={finalRating}
                        size={18}
                        transition
                        fillColor="gold"
                        emptyColor="lightgray"
                        onClick={(e) => {
                            console.log(e.target);
                            handleRating(finalRating, book.id)
                        }}
                    />
                    ({finalAvgRating})
                </>
            );
            let action;
            if (updatedTag === 'to-read') {
                action = (
                    <>
                        <button type="button" onClick={() => startReading(book.id)} title="Mark as Currently Reading">Start Reading</button>
                        <button type="button"><span>&#43;</span> View </button>
                    </>
                );
            } else {
                action = <button type="button"><span>&#43;</span> View </button>;
            }
            //let action = updatedTag == 'to-read' ? <><button type="button" onClick={()=>startReading(book.id)} title="Mark as Currently Reading">Start Reading</button><button type="button"><span>&#43;</span> View </button></>: <button type="button"><span>&#43;</span> View </button>;
            dataSource.push({ cover: cover, title: title, author: authors, shelves: shelves, avgRating: avgRating, action: action});
        });
        console.log('existingBooks.length:', existingBooks.length);
        return <>
            <div id="bookShelfResults">
                {existingBooks.length > 0 ? <BookShelf dataSource={dataSource}/> : <span className="infoMessage">BookShelf is empty.</span>}
            </div>
        </>;
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 1:
                return renderBookShelf({rating, bookId, avgRating, tag});
            // case 2:
            //     return <>
            //         <div className="search-form">
            //             <input type="text" id="search-friends" placeholder="Search Friends By Email" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={searchFriends} />
            //             <button type="button" onClick={searchFriends}>🔍</button>
            //         </div>
            //         <div id="searchResults">
            //             {result.length > 1 ? (result?.map((reader) => <Reader reader={reader} friendIds={friendIds}/>)) : (result.length !== 0 ? <Reader reader={result} friendIds={friendIds}/> : searchMessage)}
            //         </div></>;
            // case 3:
            //     console.log('fetchFriendRequests');
            //     return <>
            //         <div id="searchResults">
            //             {friendRequests.length > 0 ? (friendRequests?.map((reader) => <Reader reader={reader} userType="receiver" />)) : notificationMessage}
            //         </div></>;
            default:
                return;
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