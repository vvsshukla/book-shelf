import mongoose from "mongoose";
import dotenv from "dotenv";

//Load environment variables from .env file
dotenv.config();

const connectToDb = async () => {
    console.log(`user:${process.env.atlasUser}`);
    console.log(`password:$${process.env.atlasPassword}`);
    await mongoose.connect(`mongodb+srv://${process.env.atlasUser}:${process.env.atlasPassword}@bookshelf0.7m3kzdc.mongodb.net/bookshelf?retryWrites=true&w=majority&appName=Bookshelf0`);
    console.log('working');
}

export default connectToDb;