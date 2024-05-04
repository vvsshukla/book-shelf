import React, { useState } from "react";
import {Table} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const BookShelf = ({dataSource, message}) => {     
    const columns = [
        {
            title: 'Cover',
            dataIndex: 'cover',
            key: 'cover',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Average Rating',
            dataIndex: 'avgRating',
            key: 'avgRating'
        },
        {
            title: 'Shelves',
            dataIndex: 'shelves',
            key: 'shelves'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action'
        }
    ];
    
    return (
        <Table dataSource={dataSource} columns={columns}/>
    )
}

export default BookShelf;