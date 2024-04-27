export const updateProgress = (progress, bookId) => {
    console.log('progress:', progress, 'bookId:', bookId);
    return {
        type: "UPDATE_PROGRESS",
        progress,
        bookId
    }
}