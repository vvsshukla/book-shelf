import { signUpUser, updateUserProfile, getUserProfile, searchUserByEmail } from "../../controllers/user.js";
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
            res.json({success: true, message: 'Profile updated successfully.', existingUser});
        } else {
            res.json({success: false, message: 'Unable to update profile.', existingUser});
        }
    } catch (error) {
        console.log('Error in updateProfile:', error);
        res.json({success: false, message: 'Something went wrong.'});
    }
}

export const getProfile = async (req, res) => {
    try {
        console.log('test getProfile');
        console.log('req.body:', req.body);
        let { userId } = req.body;
        const userProfile = await getUserProfile({userId});
        if (userProfile?._id !== "") {
            res.json({success: true, profile : userProfile});
        } else {
            res.json({success: false, profile: userProfile});
        }
        return Promise.resolve(userProfile);
    } catch (error) {
        console.log('Error in getProfile', error);
    }
}

export const searchUser = async (req, res) => {
    try {
        let {email} = req.body;
        let user = await searchUserByEmail({email});
        console.log('api user:', user);
        if (user !== null && typeof user._id !== "undefined") {
            res.status(200).json({success: true, user});
        } else {
            res.status(200).json({success: true, message: 'Sorry, user not found.', user});
        }
    } catch (error) {
        console.log('signIn Error:', error);
        res.status(401).json({success: false, message: 'Something went wrong.'});
    }
}