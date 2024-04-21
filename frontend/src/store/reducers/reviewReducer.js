

const initState = {
    avgRating: 0,
    rating: '',
    newBook:{},
    bookShelfExternalIds:[]
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
                rating: action.rating
            };
        }
        case "ADD_BOOK_TO_SHELF":{
            console.log('ADD_BOOK_TO_SHELF state:',action);
            return {
                ...state,
                newBook:action.bookDetails
            }
        }
        default:{
            return {
                ...state
            };
        }
    }
}