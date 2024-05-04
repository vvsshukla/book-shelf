import { Double, ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

const activitySchema = new Schema({
    type: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        ref: "user",
        required: true
    },
    bookId: {
        type: ObjectId,
        ref: "book",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number 
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Activity = model('Activity', activitySchema);
export default Activity;