const initState = {
    bookProgress: '',
    progressBookId: '',
    updatedTag:''
}

export default (state = initState, action) => {
        switch (action.type) {
            case 'UPDATE_PROGRESS':{
                return {
                    ...state,
                    bookProgress: action.progress,
                    progressBookId: action.bookId,
                    updatedTag: action.tag
                }
            }
            case 'RESET_PROGRESS': {
                return {
                    bookProgress: '',
                    progressBookId: '',
                    updatedTag:''
                }
            }
            default:
                return state;
        }
}