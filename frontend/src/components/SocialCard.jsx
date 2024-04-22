import React from "react";
import { BookCard } from "./BookCard";
import "./BookCard.css";
import { Rating } from "react-simple-star-rating";


export const SocialCard = ({book, user, rating}) => {
    console.log('book:', book, 'user:', user);
    return (
        <div className="socialCard">
            <p><span className="capitalize">{user.firstname} {user.lastname}</span> rated a book <Rating
                        initialValue={rating}
                        size={18}
                        transition
                        fillColor="gold"
                        emptyColor="lightgray"
                    /></p>
            <BookCard book={book}/>
        </div>
    )
}