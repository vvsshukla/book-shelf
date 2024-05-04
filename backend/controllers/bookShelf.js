import mongoose from "mongoose";
import Bookshelf from "../database/models/bookShelf.js";
import BookShelfUser from "../database/models/bookShelfUser.js";
import Review from "../database/models/review.js";
import Activity from "../database/models/activity.js";

export const addBookToShelf = async ({ title, authors, externalId, imageLinks, userId }) => {
    try {
        let newBook = await Bookshelf.findOne({externalId: externalId});
        if (!newBook) {
            newBook = await Bookshelf.create({ title, authors, externalId, imageLinks});
        }
        //const newBook = await Bookshelf.create({ title, authors, externalId, imageLinks});
        const bookId = newBook._id;
        const newbookShelfUser = await BookShelfUser.create({ bookId, userId });
        console.log('newbookShelfUser:', newbookShelfUser);
        return Promise.resolve(newBook);
    } catch (error) {
        return Promise.reject({ error });
    }
}

export const fetchBooksfromShelf = async ({ userId }) => {
    try {
        console.log('type:', typeof userId, userId);
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        //const books = await Bookshelf.find({userId: userIdObjectId});
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
            await Activity.create({type: 'review', userId: userIdObjectId, bookId: bookIdObjectId, content: "added a review."});
        } else {
            await Activity.create({type: 'rating', userId: userIdObjectId, bookId: bookIdObjectId, content: "rated a book.", rating: rating});
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
    await BookShelfUser.updateOne({bookId: bookIdObjectId, userId: userIdObjectId}, {$set:{progress: progress}});
    return Promise.resolve(progress);
}