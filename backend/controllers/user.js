import User from "../database/models/user.js";

export const signUpUser = async ({firstname, lastname, email, password}) => {
    try {
        console.log('User details:', {firstname, lastname, email, password});
        const newUser = await User.create({firstname, lastname, email, password});
        console.log('newUser:', newUser);
        return Promise.resolve(newUser);
    } catch (error) {
        return Promise.reject({error});
    }
}

export const signInUser = async ({email, password}) => {
    try {
        console.log('Login details:', {email, password});
        const user = await User.findOne({email});
        console.log('user:', user);
        if (user?._id) {
            let match = await user.checkPassword(password);
            if (match) {
                await user.updateLastLoggedIn();
                return Promise.resolve(user);
            } else {
                console.log('controller Invalid username or password');
                return({success:false, message:'Invalid username or password'});
            }
        } else {
            return Promise.resolve({success:false, message:'No account is associated with this email.'});
        }
        
    } catch (error) {
        console.log('signInUser error:', error);
        return Promise.reject({error});     
    }
}

export const updateUserProfile = async ({firstname, lastname, phone, gender}) => {
    try {
        console.log('Profile details:', {firstname, lastname, phone, gender});
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        const result = await User.updateOne({ userId: userIdObjectId }, { $set: { firstname: firstname, lastname: lastname, phone: phone, gender: gender}}, { upsert: true });
        console.log('updateOne result:', result);
        if (result) {
            return({success:true, message:'Profile updated successfully.'});
        } else {
            return({success:false, message:'Unable to update profile.'});
        }
    } catch (error) {
        console.log('updateUserProfile error:', error);
        return Promise.reject({error});     
    }
}