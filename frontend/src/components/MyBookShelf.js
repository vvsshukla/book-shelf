import React from "react";
import { SearchBooks } from "./SearchBooks";
import { Header } from "./Header";

const MyBookShelf = () => {
    return (
        <>
            <Header/>
            <div className="content">
            <SearchBooks/>
            </div>
        </>
    )
}

export default MyBookShelf;