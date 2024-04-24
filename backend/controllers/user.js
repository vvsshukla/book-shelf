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