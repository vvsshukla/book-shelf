import { ObjectId } from "mongodb";
import { Schema, model} from "mongoose";

const bookShelfUserSchema = new Schema({
        bookId: {
            type: ObjectId,
            ref: "bookShelf",
            required: true
        },
        userId: {
            type: ObjectId,
            ref:"user",
            required: true
        },
        tag: {
            type: String,
            default: 'to-read'
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
});

const BookShelfUser = model('BookShelfUser', bookShelfUserSchema);
export default BookShelfUser;