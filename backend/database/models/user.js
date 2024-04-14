import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";
const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    lastLoggedIn: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        //const hashedPassword = await bcryptjs.hash(this.password, 10);
        this.password = bcryptjs.hashSync(this.password, 10);
        console.log('this.password:', this.password);
        next();
        //this.password = bcryptjs.hashSync(hashedPassword, 10);
    } catch (error) {
        console.log('Error:', error);
    }
});

userSchema.methods.checkPassword = async function (password) {
    const match = await bcryptjs.compare(password, this.password);
    console.log('match:', match);
    if (match) {
        return Promise.resolve();
    } else {
        return Promise.reject();
    }
}

userSchema.methods.updateLastLoggedIn = function () {
    return this.model('User').findOneAndUpdate(
        { email: this.email },
        { $set: { lastLoggedIn: new Date() } },
        { new: true }
    );
}

const User = model("User", userSchema);
export default User;