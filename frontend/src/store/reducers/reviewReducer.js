

const initState = {
    avgRating: 0,
    rating: '',
    newBook:{}
}

export default (state = initState, action) => {
    switch (action.type) {
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