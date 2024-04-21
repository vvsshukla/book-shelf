import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";
const bookShelfSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    authors: {
        type:[String],
        required: true
    },
    externalId: {
        type: String,
        required: true,
        unique: true
    },
    imageLinks: {
        type: Object,
        required: true
    },
    avgRating: {
        type: Number,
        default: 0.0
    },
    createdAt: { type: Date, default: Date.now }
});

const Bookshelf = model('BookShelf', bookShelfSchema);
export default Bookshelf;