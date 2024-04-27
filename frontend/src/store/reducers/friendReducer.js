const initState = {
    receiverId: '',
    isRequestSent: false
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

        default: {
            return state;
        }
    }
}