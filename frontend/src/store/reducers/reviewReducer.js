const initState = {
    avgRating: 0,
    rating: '',
    newBook:{},
    bookShelfExternalIds:[],
    bookId: '',
    tag:'',
    viewBookId:''
}

export default (state = initState, action) => {
    switch (action.type) {
        case "GET_EXISTING_BOOKS":{
            console.log('action:', action);
            let externalIds = action?.existingBooks.map(book => book.externalId);
            console.log('externalIds:', externalIds);
            return {
                ...state,
                bookShelfExternalIds: externalIds
            }
        }
        case "UPDATE_RATING":{
            console.log('action:', action);
            return {
                ...state,
                rating: action.rating,
                avgRating: action.avgRating,
                bookId: action.bookId
            };
        }
        case "ADD_BOOK_TO_SHELF":{
            console.log('ADD_BOOK_TO_SHELF reducer action:', action);
            return {
                ...state,
                newBook: action.bookDetails,
                bookId: action.bookDetails?._id
            }
        }
        case "START_READING": {
            console.log('START_READING reducer action:', action);
            return {
                ...state,
                tag: action.tag,
                bookId: action.bookId
            }
        }
        case 'RESET_REVIEW': {
            return {
                avgRating: 0,
                rating: '',
                newBook: {},
                bookShelfExternalIds: [],
                bookId: '',
                tag: '',
                viewBookId: ''
            }
        }
        case 'SET_VIEW_BOOK_ID':{
            return {
                ...state,
                viewBookId: action.viewBookId
            }
        }
        default:{
            return {
                ...state
            };
        }
    }
}