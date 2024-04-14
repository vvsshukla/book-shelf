import { signUpUser } from "../../controllers/user.js";
const signUp = async (req, res) => {
    try {
        console.log('test signUp');
        console.log('req.body:', req.body);
        let { firstname, lastname, email, password } = req.body;
        await signUpUser({ firstname, lastname, email, password });
        res.json({success: true, message: 'Registered Successfully!'});
    } catch (error) {
        console.log('Error in signUpUser:', error);
        res.json({ error: error });
    }
}

export default signUp;