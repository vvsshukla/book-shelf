const initState = {
    bookProgress: ''
}

export default (state = initState, action) => {
        switch (action.type) {
            case 'UPDATE_PROGRESS':{
                return {
                    ...state,
                    bookProgress: action.progress
                }
            }
            default:
                return state;
        }
}