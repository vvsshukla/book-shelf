import { fetchBooksfromShelf } from "../../controllers/bookShelf.js";
import { addBookToShelf } from "../../controllers/bookShelf.js";

export const addBook = async (req, res) => {
    try {
        console.log('test addBook');
        console.log('req.body:', req.body);
        let {title, authors, externalId, imageLinks} = req.body;
        let newBook = await addBookToShelf({title, authors, externalId, imageLinks});
        res.status(200).json({success: true, message: 'Book added to shelf.', newBook});   
    } catch (error) {
        console.error('Error in shelf:', error);
    }
}

export const fetchBooks = async (req, res) => {
    try {
        console.log('test fetchBooks');
        console.log('req.body:', req.body);
        let books = await fetchBooksfromShelf();
        res.status(200).json({success: true, books});
    } catch (error) {
        console.error('Error in fetching:', error);
    }
}