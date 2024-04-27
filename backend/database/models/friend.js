import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";
const friendSchema = new Schema({
    senderId: {
        type: ObjectId,
        ref: "user",
        required: true 
    },
    receiverId: {
        type: ObjectId,
        ref: "user",
        required: true
    },
    requestStatus: {
        type: String,
        required: true,
        default:"sent"
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    AcknowledgedAt: {
        type: Date,
        default:null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Friend = model('Friend', friendSchema);
export default Friend;