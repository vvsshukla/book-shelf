const initState = {
    receiverId: '',
    isRequestSent: false,
    requestId:'',
    requestStatus:''
}

export default (state = initState, action) => {
    switch (action.type) {
        case 'ADD_FRIEND':{
            return {
                ...state,
                receiverId: action.receiverId,
                isRequestSent: true
            }
        }

        case 'UPDATE_FRIEND_REQUEST_STATUS':{
            return {
                ...state,
                requestId: action.requestId,
                requestStatus: action.requestStatus
            }
        }

        default: {
            return state;
        }
    }
}