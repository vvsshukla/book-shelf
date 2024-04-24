import {Router} from "express";
import {signUp, updateProfile} from "./sign-Up.js";
import signIn from "./sign-In.js";
import {addBook, fetchBooks, updateBookReview, startReading, fetchCurrentlyReadingBooks} from "./book-Shelf.js";
import {fetchUpdatesByfriends, updateProgress} from "./book-Shelf.js";
const router = Router();
router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/addBookToShelf', addBook);
router.post('/books', fetchBooks);
router.post('/updateRating', updateBookReview);
router.post('/startReading', startReading);
router.post('/currentlyReadingBooks', fetchCurrentlyReadingBooks);
router.post('/fetchUpdates', fetchUpdatesByfriends);
router.post('/updateProgress', updateProgress);
router.post('/profile', updateProfile);
export default router;