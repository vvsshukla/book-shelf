import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { Header } from "./Header";
import axios from "axios";
import "./ViewBook.css";
import { useAuth } from "../hooks/useAuth";

const ViewBook = () => {
    const [book, setBook] = useState({});
    const [loader, setLoader] = useState(true);
    const [rating, setRating] = useState(0);
    const {user} = useAuth();
    const {bookId} = useParams();
    console.log('viewBookId:', bookId);

    const fetchBookDetails = async () => {
        let headers = {
            'Content-Type':'application/json'
        }
        let data = {
            bookId: bookId
        }
        const response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/bookDetails', data, headers);
        console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            setBook(response.data);
            setLoader(false);
        }
    }

    // if (viewBookId) {
    //     fetchBookDetails();
    // }
    useEffect(() => {
            fetchBookDetails();
    }, []);
    console.log('book:', book);
    return <>
              <Header />
              {loader ? <div>Loading...</div> : 
              <div id="bookDetailsDiv">
                    <h3>Book Details</h3>
                    <div id="book">
                        <div id="bookImage">
                            <div className="contentRow">
                                <img src={book.imageLinks.thumbnail} />
                            </div>
                        </div>
                        <div id="otherBookDetails">
                            <div className="contentRow">
                                <label className="contentLabel">Title</label>
                                <div className="reviewContentValue">
                                    <label className="reviewContentValue capitalize">{book.title}</label>
                                </div>
                            </div>
                            <div className="contentRow">
                                <label className="contentLabel">Subtitle</label>
                                <div className="reviewContentValue">
                                    <label className="reviewContentValue capitalize">{book?.subtitle ? book.subtitle :'Not Available'}</label>
                                </div>
                            </div>
                            <div className="contentRow">
                                <label className="contentLabel">Description</label>
                                <div className="reviewContentValue">
                                    <label className="reviewContentValue">{book?.description ? book.description :'Not Available'}</label>
                                </div>
                            </div>
                            <div className="contentRow">
                                <label className="contentLabel">Authors</label>
                                <div className="reviewContentValue">
                                    <label className="reviewContentValue capitalize">{book.authors}</label>
                                </div>
                            </div>
                            <div className="contentRow">
                                <label className="contentLabel">Rating</label>
                                <div className="reviewContentValue">
                                <label className="reviewContentValue capitalize">
                                    <Rating
                                        initialValue={book.avgRating}
                                        size={18}
                                        transition
                                        fillColor="gold"
                                        emptyColor="lightgray"
                                    />
                                </label>
                                </div>
                            </div>
                            <div className="contentRow">
                                <label className="contentLabel">Language</label>
                                <div className="reviewContentValue">
                                    <label className="reviewContentValue capitalize">{book.language ? book.language : 'Not Available'}</label>
                                </div>
                            </div>
                            <div className="contentRow">
                                <label className="contentLabel">Pagecount</label>
                                <div className="reviewContentValue">
                                    <label className="reviewContentValue capitalize">{book.pageCount ? book.pageCount : 'Not Available'}</label>
                                </div>
                            </div>
                            <div className="contentRow">
                                <label className="contentLabel">Maturity Rating</label>
                                <div className="reviewContentValue">
                                    <label className="reviewContentValue capitalize">{book.maturityRating ? book.maturityRating : 'Not Available'}</label>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>}              
           </>;
}

export default ViewBook;