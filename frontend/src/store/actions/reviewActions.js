export const getExistingBooks = (existingBooks) => {
    console.log('existingBooks:', existingBooks);
    return {
        type: "GET_EXISTING_BOOKS",
        existingBooks
    }
}


export const updateRating = (rating, avgRating, bookId) => {
    console.log('updateRating:', rating);
    return {
        type: "UPDATE_RATING",
        rating,
        avgRating,
        bookId
    }
}

export const addBook = (bookDetails) => {
    console.log('ADD_BOOK_TO_SHELF action:', bookDetails);
    return {
        type: "ADD_BOOK_TO_SHELF",
        bookDetails
    }
}

export const updateTag = (tag, bookId) => {
    console.log('START_READING action:', tag, bookId);
    return {
        type: "START_READING",
        tag,
        bookId
    }
}