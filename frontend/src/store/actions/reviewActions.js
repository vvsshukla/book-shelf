

export const updateRating = (rating) => {
    console.log('updateRating:', rating);
    return {
        type: "UPDATE_RATING",
        rating
    }
}

export const addBook = (bookDetails) => {
    console.log('ADD_BOOK_TO_SHELF action:', bookDetails);
    return {
        type: "ADD_BOOK_TO_SHELF",
        bookDetails
    }
}