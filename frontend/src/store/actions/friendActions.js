export const addFriend = (receiverId) => {
    return {
        type: 'ADD_FRIEND',
        receiverId
    }
}

export const updateFriendRequestStatus = (requestId, requestStatus) => {
    return {
        type: 'UPDATE_FRIEND_REQUEST_STATUS',
        requestId, 
        requestStatus
    }
}

export const reset = () => {
    return {
        type:'RESET'
    }
}