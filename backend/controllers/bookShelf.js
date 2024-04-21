import mongoose from "mongoose";
import Bookshelf from "../database/models/bookShelf.js";

export const addBookToShelf = async ({title, authors, externalId, imageLinks, userId}) => {
    try {
        const newBook = await Bookshelf.create({title, authors, externalId, imageLinks, userId});
        return Promise.resolve(newBook);
    } catch (error) {
        return Promise.reject({error});
    }
}

export const fetchBooksfromShelf = async({userId}) => {
    try {
        console.log('type:', typeof userId, userId);
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        const books = await Bookshelf.find({userId: userIdObjectId});
        return Promise.resolve(books);
    } catch (error) {
        return Promise.reject({error});   
    }
}