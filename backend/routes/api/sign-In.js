import {signInUser} from "../../controllers/user.js";
const signIn = async (req, res) => {
    try {
        console.log('test signIn');
        console.log('req.body:',req.body);
        let {email, password} = req.body;
        let user = await signInUser({email, password});
        if (user) {
            req.session.user = {
                id: user._id,
                firstname: user.firstname,
                email: user.email,
                lastLoggedIn: user.lastLoggedIn
            }
            res.status(200).json({success: true, message: 'Login Successful', user});
        } else {
            res.status(200).json({success: false, message: 'Invalid username or password', user});
        }
        
    } catch (error) {
        console.log('signIn Error:', error);
        res.status(401).json({success: false, message: 'Something went wrong.'});
    }
}

export default signIn;