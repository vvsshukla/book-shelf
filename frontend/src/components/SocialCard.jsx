import React from "react";
import { BookCard } from "./BookCard";
import "./BookCard.css";
import { Rating } from "react-simple-star-rating";


export const SocialCard = ({update}) => {
    let book = update.bookId;
    let user = update.userId;
    let rating = update.rating ? update.rating : book.avgRating;
    console.log('rating:', rating);

    const renderContent = (type) => {
        switch (type) {
            case 'rating':
                return <><p><span className="capitalize">{user.firstname} {user.lastname}</span> {update.content}</p><BookCard book={book} section={'SocialCard'} bookuser={user}/></>;
            
            case 'currently-reading':
                return <><p><span className="capitalize">{user.firstname} {user.lastname}</span> {update.content}</p><BookCard book={book} section={'SocialCard'} bookuser={user}/></>;

            case 'review':
                return <><p><span className="capitalize">{user.firstname} {user.lastname}</span> {update.content}</p><BookCard book={book} section={'SocialCard'} bookuser={user}/></>;
        }
    }

    console.log('book:', book, 'user:', user);
    return (
        <div className="socialCard">
                {renderContent(update.type)}           
        </div>
    )
}