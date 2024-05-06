import React from "react";
import {Table} from "antd";

const Library = ({dataSource}) => {
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
            title: 'Action',
            dataIndex: 'action',
            key: 'action'
        }
    ];
    
    return (
        <div id="searchResult">
            <Table dataSource={dataSource} columns={columns}/>
        </div>
    )
}

export default Library;