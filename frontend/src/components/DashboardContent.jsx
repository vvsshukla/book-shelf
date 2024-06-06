import React from "react";
import { Table } from "antd";

export const DashboardContent = ({dataSource}) => {
    const columns = [
        {
            title: 'Currently Reading',
            dataIndex: 'currently-reading',
            key: 'currently-reading'
        },
        {
            title: 'Social Cards',
            dataIndex: 'social-cards',
            key: 'social-cards'
        }
    ];
    return (
        <div className="dashboardContent">
                {/* <CurrentlyReading />
                <SocialCards/> */}
                <Table dataSource={dataSource} columns={columns}/>
        </div>
    );
}