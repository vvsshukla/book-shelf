import mongoose from "mongoose";
import Bookshelf from "../database/models/bookShelf.js";
import BookShelfUser from "../database/models/bookShelfUser.js";
import Review from "../database/models/review.js";
import Activity from "../database/models/activity.js";
import User from "../database/models/user.js";
import { book } from "../routes/api/book-Shelf.js";

export const addBookToShelf = async ({ title, authors, externalId, imageLinks, userId, description, publishedDate, language, pageCount, maturityRating}) => {
    try {
        let newBook = await Bookshelf.findOne({externalId: externalId});
        if (!newBook) {
            newBook = await Bookshelf.create({ title, authors, externalId, imageLinks, description, publishedDate, language, pageCount, maturityRating});
        }
        //const newBook = await Bookshelf.create({ title, authors, externalId, imageLinks});
        const bookId = newBook._id;
        const newbookShelfUser = await BookShelfUser.create({ bookId, userId });
        console.log('newbookShelfUser:', newbookShelfUser);
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        await User.updateOne({_id:userIdObjectId}, {$inc:{booksCount:1}})
        return Promise.resolve(newBook);
    } catch (error) {
        return Promise.reject({ error });
    }
}

export const fetchBooksfromShelf = async ({ userId }) => {
    try {
        console.log('type:', typeof userId, userId);
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        const books = await BookShelfUser.find({ userId: userIdObjectId })
            .select('bookId userId tag')
            .populate({
                path: 'bookId',
                model: 'BookShelf',
                select: 'title authors externalId imageLinks avgRating',
            })
            .exec();
        console.log('books:', books);
        return Promise.resolve(books);
    } catch (error) {
        return Promise.reject({ error });
    }
}

export const updateBookReviewByUser = async ({ rating, comment, bookId, userId}) => {
    let review = null;
    try {
        console.log('req:', { rating, comment, bookId, userId});
        const bookIdObjectId = new mongoose.Types.ObjectId(bookId);
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        const result = await Review.updateOne({ bookId: bookIdObjectId, userId: userIdObjectId }, { $set: { rating: rating, comment: comment } }, { upsert: true });
        console.log('updateOne result:', result);

        const reviews = await Review.find({ bookId: bookIdObjectId });
        const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        const avgRating = totalRating / reviews.length;

        await Bookshelf.updateOne({ _id: bookIdObjectId }, { $set: { avgRating: avgRating } });

        if (comment) {
            await Activity.updateOne({bookId: bookIdObjectId, userId: userIdObjectId }, { $set: {type: 'review', content: "added a review.", updatedAt: Date.now()} }, { upsert: true });
        } else {
            await Activity.updateOne({bookId: bookIdObjectId, userId: userIdObjectId }, { $set: {type: 'rating', content: "rated a book.", rating: rating, updatedAt: Date.now()} }, { upsert: true });
        }
        review = await Review.find({ bookId: bookIdObjectId, userId: userIdObjectId });
        console.log('updated doc:', review);
        return Promise.resolve({ review, avgRating, rating });
    } catch (error) {
        console.log('Error in updateBookReviewByUser:', error);
    }
}

export const updateTagByUser = async ({bookId, userId, tag}) => {
    try {
        const bookIdObjectId = new mongoose.Types.ObjectId(bookId);
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        await BookShelfUser.updateOne({bookId: bookIdObjectId, userId: userIdObjectId}, {$set:{tag: tag}});
        await Activity.create({type: tag, userId: userIdObjectId,bookId: bookIdObjectId, content: 'marked book as '+tag});
        return Promise.resolve({tag, bookId});
    } catch (error) {
        console.log('Error in updateTagByUser:', error);
    }
}

export const getCurrentlyReadingBooks = async ({userId}) => {
    try {
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        const books = await BookShelfUser.find({userId: userIdObjectId, tag: 'currently-reading'})
            .select('bookId userId tag progress')
            .populate({
                path: 'bookId',
                model: 'BookShelf',
                select: 'title authors externalId imageLinks avgRating',
            })
            .exec();
        console.log('current books:', books);
        return Promise.resolve(books);
    } catch (error) {
        console.log('Error in getCurrentlyReadingBooks:', error);
    }
}

export const getSocialCardUpdatesByUser = async ({userId, friendIds}) => {
    try {
        console.log('friendIds:', friendIds);
        let friendObjectIds = friendIds.map((id)=> new mongoose.Types.ObjectId(id));
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        console.log('friendObjectIds:', friendObjectIds);
        const socialCardUpdates = await Activity.find({userId: {$in:friendObjectIds}})
                                   .select('bookId userId type content rating')
                                   .populate({
                                        path: 'bookId',
                                        model: 'BookShelf',
                                        select: 'title authors externalId imageLinks avgRating'
                                   })
                                   .populate({
                                        path: 'userId',
                                        model: 'User',
                                        select: 'firstname lastname'
                                   })
                                   .exec();
        console.log('socialCardUpdates:', socialCardUpdates);
        return Promise.resolve(socialCardUpdates);
    } catch (error) {
        console.log('Error in getSocialCardUpdatesByUser:', error);
    }
}

export const updateBookProgress = async ({userId, bookId, progress}) => {
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    const bookIdObjectId = new mongoose.Types.ObjectId(bookId);
    console.log('progress:', progress);
    let response = {};
    if (progress == 100) {
        console.log('update tag completed');
        await BookShelfUser.updateOne({bookId: bookIdObjectId, userId: userIdObjectId}, {$set:{progress: progress, tag: 'completed'}});
        response = {progress: progress, tag: 'completed'};
    } else {
        await BookShelfUser.updateOne({bookId: bookIdObjectId, userId: userIdObjectId}, {$set:{progress: progress}});
        response = {progress: progress, tag: 'currently-reading'};
    }
    return Promise.resolve(response);
}

export const fetchBookReview = async ({userId, bookId}) => {
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    const bookIdObjectId = new mongoose.Types.ObjectId(bookId);
    const reviews = await Review.findOne({ bookId: bookIdObjectId, userId: userIdObjectId });
    console.log('reviews:', reviews);
    return Promise.resolve(reviews);
}

export const fetchBookDetails = async ({bookId}) => {
    const bookIdObjectId = new mongoose.Types.ObjectId(bookId);
    const bookDetails = await Bookshelf.findOne({_id:bookIdObjectId});
    console.log('bookDetails:', bookDetails);
    return Promise.resolve(bookDetails);
}

export const fetchBookfromShelf = async ({ userId, bookId }) => {
    try {
        const bookIdObjectId = new mongoose.Types.ObjectId(bookId);
        const book = await Bookshelf.findOne({_id: bookIdObjectId });
        console.log('book:', book);
        return Promise.resolve(book);
    } catch (error) {
        return Promise.reject({ error });
    }
}