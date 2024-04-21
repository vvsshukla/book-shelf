import { fetchBooksfromShelf, updateBookReviewByUser, addBookToShelf} from "../../controllers/bookShelf.js";

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
        let {bookId, userId}= req.body;
        let tag = await updateTagByUser({bookId, userId});
        res.status(200).json({success:true, tag});
    } catch (error) {
        console.log('Error in startReading:', error);
    }
}