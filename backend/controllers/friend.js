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

export const getFriendRequests = async ({receiverId}) => {
    try {
        let receiverIdObjectId = new mongoose.Types.ObjectId(receiverId);
        let requests = await Friend.find({receiverId: receiverIdObjectId, requestStatus: 'sent', AcknowledgedAt: null})
                                   .select('senderId requestStatus sentAt AcknowledgedAt')
                                   .populate({  
                                        path: 'senderId',
                                        model: 'User',
                                        select: 'firstname lastname'
                                   })
                                   .exec();
        console.log('friendrequests:', requests);
        return Promise.resolve(requests);
    } catch (error) {
        return Promise.resolve(error);
    }
}

export const updateFriendRequestStatus = async ({requestId, requestStatus}) => {
    try {
        console.log('requestId, requestStatus:', {requestId, requestStatus});
        const requestIdObjectId = new mongoose.Types.ObjectId(requestId);
        await Friend.updateOne({_id: requestIdObjectId}, { $set: { requestStatus: requestStatus, AcknowledgedAt: Date.now()}}, { upsert: true }); 
        return Promise.resolve(true);
    } catch (error) {
        console.log('updateFriendRequestStatus error:', error);
        return Promise.reject(error);     
    }
}