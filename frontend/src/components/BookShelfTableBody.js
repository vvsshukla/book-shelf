import React from "react";
import { BookItem } from "./BookItem";

export const BookShelfTableBody = ({ source, shelfBooks, search}) => {
    return (
        <div id="tbody">
            {shelfBooks?.map((book) => {
                let key = source === 'external' ? book.externalId : book.id;
                let smallThumbnail = book.smallThumbnail;
                if (smallThumbnail !== undefined) {
                    return (
                        <BookItem book={book} source={source} key={key} search={search}/>
                    )
                }
                return <><div>No record found.</div></>
            })}
        </div>
    )
}