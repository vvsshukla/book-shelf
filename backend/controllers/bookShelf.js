import {Types} from "mongoose";
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
        const books = await Bookshelf.find({userId: Types.ObjectId(userId)});
        return Promise.resolve(books);
    } catch (error) {
        return Promise.reject({error});   
    }
}