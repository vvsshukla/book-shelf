import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";
const reviewSchema = new Schema({
    rating:{
        type: Number,
        required: true
    },
    comment:{
       type: String         
    },
    bookId:{
        type: ObjectId,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = model('Review', reviewSchema);
export default Review;