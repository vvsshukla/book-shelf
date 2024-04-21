import {Router} from "express";
import signUp from "./sign-Up.js";
import signIn from "./sign-In.js";
import {addBook, fetchBooks, updateBookReview, startReading} from "./book-Shelf.js";

const router = Router();
router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/addBookToShelf', addBook);
router.post('/books', fetchBooks);
router.post('/updateRating', updateBookReview);
router.post('/startReading', startReading);
export default router;