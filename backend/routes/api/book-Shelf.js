import { fetchBooksfromShelf, updateBookReviewByUser, addBookToShelf, updateTagByUser, fetchBookfromShelf} from "../../controllers/bookShelf.js";
import { getCurrentlyReadingBooks, getSocialCardUpdatesByUser, updateBookProgress, fetchBookReview, fetchBookDetails} from "../../controllers/bookShelf.js";

export const addBook = async (req, res) => {
    try {
        console.log('test addBook');
        console.log('req.body:', req.body);
        let {title, authors, externalId, imageLinks, userId} = req.body;
        let newBook = await addBookToShelf({title, authors, externalId, imageLinks, userId});
        res.status(200).json({success: true, message: 'Book added to shelf.', newBook});   
    } catch (error) {
        console.error('Error in shelf:', error);
    }
}

export const fetchBooks = async (req, res) => {
    try {
        console.log('req:', req.body);
        let {userId} = req.body;
        console.log('fetchBooks userId:', userId);
        let books = await fetchBooksfromShelf({userId});
        res.status(200).json({success: true, books});
    } catch (error) {
        console.error('Error in fetching:', error);
    }
}

export const updateBookReview = async (req, res) => {
    try {
        console.log('req:', req.body);
        let {rating, comment, bookId, userId} = req.body;
        console.log('req:', {rating, comment, bookId, userId});
        let review = await updateBookReviewByUser({rating, comment, bookId, userId});
        res.status(200).json({success:true, review});
    } catch (error) {
        console.log('Error in review:', error);
    }    
}

export const startReading = async (req, res) => {
    try {
        let {bookId, userId, tag}= req.body;
        let updatedTag = await updateTagByUser({bookId, userId, tag});
        res.status(200).json({success:true, updatedTag});
    } catch (error) {
        console.log('Error in startReading:', error);
    }
}

export const fetchCurrentlyReadingBooks = async (req, res) => {
    try {
        let {userId} = req.body;
        let books = await getCurrentlyReadingBooks({userId});
        res.status(200).json({success: true, books});
    } catch (error) {
        console.log('Error in getCurrentlyReadingBooks:', error);
    }
}

export const fetchUpdatesByfriends = async (req, res) => {
    try {
        let {userId, friendIds} = req.body;
        let updates = await getSocialCardUpdatesByUser({userId, friendIds});
        res.status(200).json(updates);
    } catch (error) {
        console.log('Error in fetchUpdatesByfriends', error);
    }
}

export const updateProgress = async (req, res) => {
    try {
        let {userId, bookId, progress} = req.body;
        let result = await updateBookProgress({userId, bookId, progress});
        res.status(200).json(result);
    } catch (error) {
        console.log('Error in updateProgress:', error);
    }
}

export const fetchReview = async (req, res) => {
    try {
        let {userId, bookId} = req.body;
        let result = await fetchBookReview({userId, bookId});
        res.status(200).json(result);
    } catch (error) {
        console.log('Error in updateProgress:', error);
    }
}

export const book = async (req, res) => {
    try {
        let {bookId} = req.body;
        let result = await fetchBookDetails({bookId});
        res.status(200).json(result);
    } catch (error) {
        console.log('Error in book details:', error);    
    }    
}

export const bookDetails = async (req, res) => {
    try {
        let {bookId, userId} = req.body;
        let result = await fetchBookfromShelf({bookId, userId});
        res.status(200).json(result);
    } catch (error) {
        console.log('Error in book details:', error);
    }   
}