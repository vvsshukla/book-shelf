import { signUpUser, updateUserProfile } from "../../controllers/user.js";
export const signUp = async (req, res) => {
    try {
        console.log('test signUp');
        console.log('req.body:', req.body);
        let { firstname, lastname, email, password } = req.body;
        const newUser = await signUpUser({ firstname, lastname, email, password });
        res.json({success: true, message: 'Registered Successfully', newUser});
    } catch (error) {
        console.log('Error in signUpUser:', error);
        res.json({ error: error });
    }
}

export const updateProfile = async (req, res) => {
    try {
        console.log('test updateProfile');
        console.log('req.body:', req.body);
        let { firstname, lastname, phone, gender, userId} = req.body;
        const existingUser = await updateUserProfile({firstname, lastname, phone, gender, userId});
        if (existingUser) {
            res.json({success: true, message: 'Profile updated successfully', existingUser});
        } else {
            res.json({success: false, message: 'Unable to update profile.', existingUser});
        }
    } catch (error) {
        console.log('Error in updateProfile:', error);
        res.json({success: false, message: 'Something went wrong.'});
    }
}