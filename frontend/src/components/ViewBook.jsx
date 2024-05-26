import React, {useState} from "react";
import { useDispatch, useSelector} from "react-redux";

const ViewBook = () => {
    let {viewBookId} = useSelector(state => state.review);
    console.log('viewBookId:', viewBookId);
    return <div>
        View Book
    </div>;
}

export default ViewBook;