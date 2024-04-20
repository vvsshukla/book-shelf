import React, { useState } from "react";
import axios from "axios";
import { BookItem } from "./BookItem";

export const BookShelfTableBody = ({ source, shelfBooks }) => {
    const [newBook, setNewBook] = useState({});
    // const [rating, setRating] = useState(0);
    // const dispatch = useDispatch();

    const addToBookShelf = async ({ bookDetails }) => {
        const headers = {
            'Content-Type': 'application/json'
        }
        const response = await axios.post('http://localhost:5000/api/addBookToShelf', bookDetails, headers);
        console.log('response:', response);
        if (typeof response !== "undefined" && typeof response.data !== "undefined" && typeof response.data.newBook !== "undefined") {
            console.log('Book added successfully.');
            setNewBook(response.data.newBook);
        }
    }

    return (
        <div id="tbody">
            {shelfBooks?.map((book) => {
                console.log('book.id:', book.id);
                let key = source==='external'? book.externalId : book.id;
                let smallThumbnail = book.smallThumbnail;
                if (smallThumbnail !== undefined) {
                    return (
                        <BookItem book={book} source={source} key={key}/>
                    )
                }
                return <><div>No record found.</div></>
            })}
        </div>
    )
}

/*onClick={() => viewBook({ bookDetails })}*/
// const mapDispatchToProps = dispatch => {
//     return {
//         onUpdateRating : (rating) => dispatch(updateRating(rating))
//     }
// }

// export default connect(mapDispatchToProps)(BookShelfTableBody);