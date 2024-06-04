const initState = {
    bookProgress: '',
    progressBookId: '',
    updatedTag:'',
    profileImage:''
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
            case 'SET_PROFILE_IMAGE':{
                return {
                    profileImage: action.profileImage
                }
            }
            default:
                return state;
        }
}