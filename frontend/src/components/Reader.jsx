import React from "react";
import { useAuth } from "../hooks/useAuth";
import { addFriend, updateFriendRequestStatus } from "../store/actions/friendActions";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

export const Reader = ({ reader, userType }) => {
    let firstName = '', lastName = '';
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { receiverId, requestId, requestStatus } = useSelector(state => state.friend);
    switch(userType){
        case 'friend':
            if (typeof reader._id !== "undefined") {
               if (user._id === reader.senderId._id) {
                   firstName = reader.receiverId.firstname;
                   lastName = reader.receiverId.lastname; 
               } else {
                   firstName = reader.senderId.firstname;
                   lastName = reader.senderId.lastname; 
               } 
            }
            break;
        case 'receiver':
            firstName = reader.senderId.firstname;
            lastName = reader.senderId.lastname;
            break;
        default:
            firstName = reader.firstname;
            lastName = reader.lastname;
    }

    const renderActionButtons = (userType) => {
        switch (userType) {
            case 'friend'://friends list
                return <>No Action</>
            case 'receiver': //Notifications
                console.log('userType:', userType);
                console.log('requestId:', requestId, 'reader._id:', reader._id, 'requestStatus:', requestStatus);
                if (requestId !== "" && requestId === reader._id && requestStatus !== "sent") {
                    return <label className="capitalize frStatus">{requestStatus}</label>;
                } else if (reader.receiverId === user._id) {
                    return <><button type="button" className="frActions fa fa-check" onClick={() => friendRequestAction(reader._id, 'accepted')}>Accept</button><button type="button" className="frActions fa fa-ban" onClick={() => friendRequestAction(reader._id, 'rejected')}>Reject</button></>
                }
                // else {
                //     return <><button type="button" className="frActions fa fa-check" onClick={() => friendRequestAction(reader._id, 'accepted')}>Accept</button><button type="button" className="frActions fa fa-ban" onClick={() => friendRequestAction(reader._id, 'rejected')}>Reject</button></>
                // }
            default://Add friend
                console.log('reader:', reader);
                if (reader._id === receiverId) {
                    return <span>Request sent.</span>;
                } else {
                    return <button onClick={() => add(reader._id)} className="addFrientBtn" title="Send Friend Request">&#43;</button>;
                }
        }   
    }

    //console.log('firstName:', firstName, 'lastName:', lastName);
    const add = async (reader_id) => {
        const data = { senderId: user._id, receiverId: reader_id };
        const headers = {
            'Content-Type': 'application/json'
        };
        try {
            const result = await axios.post('http://localhost:5000/api/addFriend', data, headers);
            //https://book-shelf-xvxk.onrender.com
            const response = result.data;
            if (typeof response.success !== "undefined" && response.success === true) {
                dispatch(addFriend(reader_id));
            } else {
                console.log('Unable to send request.');
            }
        } catch (error) {
            console.log('Error while adding friend:', error);
        }
    }
    const friendRequestAction = async (requestId, requestStatus) => {
        const data = { requestId: requestId, requestStatus: requestStatus };
        const headers = {
            'Content-Type': 'application/json'
        };
        try {
            const result = await axios.post('http://localhost:5000/api/acknowledgeFriendRequest', data, headers);
            console.log('result:', result);
            //https://book-shelf-xvxk.onrender.com
            const response = result.data;
            if (typeof response.success !== "undefined" && response.success === true) {
                dispatch(updateFriendRequestStatus(requestId, requestStatus));
            } else {
                console.log('Unable to send request.');
            }
        } catch (error) {
            console.log('Error while adding friend:', error);
        }
    }

    return (
        <div className="reader">
            <img src="https://s.gr-assets.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png" alt="User Profile" id="profile-photo" />
            <div className="readerDetails">
                {/* <div className="readerName capitalize">{userType === 'receiver' ? `${reader.senderId.firstname} ${reader.senderId.lastname}` : `${reader.firstname} ${reader.lastname}`}</div> */}
                <div className="readerName capitalize">{firstName} {lastName}</div>
                <div className="readerBooks">4 Books</div>
            </div>
            {renderActionButtons(userType)}
            {/* {userType === 'receiver' ? (
                requestId == reader._id && requestStatus !== "" ? <label className="capitalize frStatus">{requestStatus}</label> : <><button type="button" className="frActions fa fa-check" onClick={() => friendRequestAction(reader._id, 'accepted')}>Accept</button><button type="button" className="frActions fa fa-ban" onClick={() => friendRequestAction(reader._id, 'rejected')}>Reject</button></>
            ) : (reader._id === receiverId ? <span>Request sent.</span> : <button onClick={() => add(reader._id)} className="addFrientBtn" title="Send Friend Request">&#43;</button>)
            } */}
        </div>
    );
}