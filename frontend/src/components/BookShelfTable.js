import React, { useState } from "react";
import "./BookShelfTable.css";
import { BookShelfTableBody } from "./BookShelfTableBody";
import { BookShelfTableHeader } from "./BookShelfTableHeader";


export const BookShelfTable = ({ shelfBooks, source, search}) => {
    return (
        <div id="searchResult">
            <div id="table">
            <BookShelfTableHeader source={source}/>
            <BookShelfTableBody source={source} shelfBooks={shelfBooks} search={search}/>
            </div>
        </div>
    );
}