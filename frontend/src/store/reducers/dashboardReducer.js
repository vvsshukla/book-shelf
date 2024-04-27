const initState = {
    bookProgress: '',
    progressBookId: ''
}

export default (state = initState, action) => {
        switch (action.type) {
            case 'UPDATE_PROGRESS':{
                return {
                    ...state,
                    bookProgress: action.progress,
                    progressBookId: action.bookId
                }
            }
            default:
                return state;
        }
}