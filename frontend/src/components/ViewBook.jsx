import React, {useState, useEffect} from "react";
import { useSelector} from "react-redux";
import { Rating } from "react-simple-star-rating";
import { Header } from "./Header";
import axios from "axios";
import "./ViewBook.css";
import { useAuth } from "../hooks/useAuth";

const ViewBook = () => {
    let {viewBookId} = useSelector(state => state.review);
    const [book, setBook] = useState({});
    const [rating, setRating] = useState(0);
    const {user} = useAuth();
    console.log('viewBookId:', viewBookId);

    const fetchBookDetails = async () => {
        let headers = {
            'Content-Type':'application/json'
        }
        let data = {
            bookId: viewBookId,
            userId: user._id
        }
        const response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/bookDetails', data, headers);
        console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data !== "undefined") {
            setBook(response.data);
        }
    }

    useEffect(() => {
        if (viewBookId) {
            fetchBookDetails();
        }
    }, []);

    return <>
              <Header />
              <div id="bookDetailsDiv">
                    <h3>Book Details</h3>
                    <div className="contentRow">
                        <label className="contentLabel">Book Title</label>
                        <div className="reviewContentValue">
                            <label className="reviewContentValue capitalize">{book.bookId.title}</label>
                        </div>
                    </div>
                    <div className="contentRow">
                        <label className="contentLabel">Authors</label>
                        <div className="reviewContentValue">
                            <label className="reviewContentValue capitalize">{book.bookId.authors}</label>
                        </div>
                    </div>
                    <div className="contentRow">
                        <label className="contentLabel">Rating</label>
                        <div className="reviewContentValue">
                            <Rating
                                initialValue={book.bookId.avgRating}
                                size={18}
                                transition
                                fillColor="gold"
                                emptyColor="lightgray"
                            />
                        </div>
                    </div>
                    {/* <div className="contentRow">
                        <button type="submit">Submit</button>
                    </div>   */}
               </div>
           </>;
}

export default ViewBook;