export const getExistingBooks = (existingBooks) => {
    return {
        type: "GET_EXISTING_BOOKS",
        existingBooks
    }
}


export const updateRating = (rating, avgRating, bookId) => {
    return {
        type: "UPDATE_RATING",
        rating,
        avgRating,
        bookId
    }
}

export const addBook = (bookDetails) => {
    return {
        type: "ADD_BOOK_TO_SHELF",
        bookDetails
    }
}

export const updateTag = (tag, bookId) => {
    return {
        type: "START_READING",
        tag,
        bookId
    }
}

export const resetReview = () => {
    return {
        type:'RESET_REVIEW'
    }
}

export const setViewBookId = (viewBookId) => {
    return {
        type:"SET_VIEW_BOOK_ID",
        viewBookId
    }
}