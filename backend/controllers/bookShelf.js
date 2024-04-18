import Bookshelf from "../database/models/bookShelf.js";

export const addBookToShelf = async ({title, authors, externalId, imageLinks}) => {
    try {
        const newBook = await Bookshelf.create({title, authors, externalId, imageLinks});
        return Promise.resolve(newBook);
    } catch (error) {
        return Promise.reject({error});
    }
}

export const fetchBooksfromShelf = async() => {
    try {
        const books = await Bookshelf.find();
        return Promise.resolve(books);
    } catch (error) {
        return Promise.reject({error});   
    }
}