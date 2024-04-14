import {Router} from "express";
import signUp from "./sign-Up.js";
import signIn from "./sign-In.js";
const router = Router();
router.post('/signin', signIn);
router.post('/signup', signUp);

export default router;