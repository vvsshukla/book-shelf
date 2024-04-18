import {Router} from "express";
import signUp from "./sign-Up.js";
import signIn from "./sign-In.js";
import {addBook, fetchBooks} from "./add-Book-To-Shelf.js";

const router = Router();
router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/addBookToShelf', addBook);
router.post('/books', fetchBooks);
export default router;