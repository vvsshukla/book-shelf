import React from "react";
import { SearchBooks } from "./SearchBooks";
import { BookShelf } from "./BookShelf";

const MyBookShelf = () => {
    return (
        <div className="content">
            <SearchBooks/>
            {/* <BookShelf/> */}
        </div>
    )
}

export default MyBookShelf;