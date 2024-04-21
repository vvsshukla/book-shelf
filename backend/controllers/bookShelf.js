import mongoose from "mongoose";
import Bookshelf from "../database/models/bookShelf.js";
import BookShelfUser from "../database/models/bookShelfUser.js";
import Review from "../database/models/review.js";

export const addBookToShelf = async ({title, authors, externalId, imageLinks, userId}) => {
    try {
        const newBookShelf = await Bookshelf.create({title, authors, externalId, imageLinks, userId});
        const bookId = newBookShelf?._id;
        const newbookShelfUser = await BookShelfUser.create({bookId, userId});
        console.log('newbookShelfUser:', newbookShelfUser);
        return Promise.resolve({newBookShelf});
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

export const updateBookReviewByUser = async({rating, comment, bookId, userId}) => {
    let review = null;
    try {
        console.log('req:', {rating, comment, bookId, userId});
        const bookIdObjectId = new mongoose.Types.ObjectId(bookId);
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        const result = await Review.updateOne({bookId: bookIdObjectId, userId: userIdObjectId}, {$set:{rating: rating, comment: comment}},{upsert: true});
        console.log('updateOne result:', result);

        const reviews = await Review.find({bookId: bookIdObjectId});
        const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        const avgRating = totalRating / reviews.length;

        await Bookshelf.updateOne({_id: bookIdObjectId}, { $set: {avgRating: avgRating}});

        review = await Review.find({bookId: bookIdObjectId, userId: userIdObjectId});
        console.log('updated doc:', review);
        return Promise.resolve({review, avgRating});
    } catch (error) {
        console.log('Error in updateBookReviewByUser:', error);
    }
}

export const updateTagByUser = async({bookId, userId}) => {
    try {
        
    } catch (error) {
        
    }
}