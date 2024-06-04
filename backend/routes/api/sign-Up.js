import { signUpUser, updateUserProfile, getUserProfile, searchUserByEmail, updateAvatarImageUrl} from "../../controllers/user.js";
import { fileURLToPath } from "url";
import md5 from "md5";
import path from "path";
const __dirname = fileURLToPath(import.meta.url);

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
        let { firstname, lastname, phone, gender, userId, avatarUrl} = req.body;
        const existingUser = await updateUserProfile({firstname, lastname, phone, gender, userId, avatarUrl});
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

export const uploadFile = async (req, res) => {
    console.log('uploadFile req.body:', req.body);
    console.log('uploadFile:', req.files.file);
    let {userId} = req.body;
    let uploadFile = req.files.file; 
    console.log('userId:', userId);
    console.log('uploadFile:', uploadFile);
    const name = uploadFile.name.replaceAll(' ', '_');
    const md5 = uploadFile.md5;
    const saveAs = `${md5}_${name}`;
    uploadFile.mv(`uploads/${saveAs}`, async function(err){
        if (err) {
            return res.status(500).send(err);
        }
        //mongodb logic
        let result = await updateAvatarImageUrl({saveAs, userId});
        if (result) {
            return res.status(200).json({success:true, message:'Avatar Uploaded Successfully.', name, saveAs});
        } else {
            return res.status(200).json({success:false, message:'Unable to upload avatar.', name, saveAs});
        }
    });
}