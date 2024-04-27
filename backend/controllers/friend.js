import Friend from "../database/models/friend.js";
import mongoose from "mongoose";

export const sendFriendRequest = async ({senderId, receiverId}) => {
    try {
        let senderIdObjectId = new mongoose.Types.ObjectId(senderId);
        let receiverIdObjectId = new mongoose.Types.ObjectId(receiverId);
        let request = await Friend.create({senderId:senderIdObjectId, receiverId: receiverIdObjectId});
        console.log('friendrequest:', request);
        return Promise.resolve(request);
    } catch (error) {
        return Promise.resolve(error);
    }
}