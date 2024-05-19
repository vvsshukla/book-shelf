import BookShelfUser from "../database/models/bookShelfUser.js";
import Friend from "../database/models/friend.js";
import mongoose from "mongoose";

export const sendFriendRequest = async ({ senderId, receiverId }) => {
    try {
        let senderIdObjectId = new mongoose.Types.ObjectId(senderId);
        let receiverIdObjectId = new mongoose.Types.ObjectId(receiverId);
        let request = await Friend.create({ senderId: senderIdObjectId, receiverId: receiverIdObjectId });
        console.log('friendrequest:', request);
        return Promise.resolve(request);
    } catch (error) {
        return Promise.resolve(error);
    }
}

export const getFriendRequests = async ({ receiverId }) => {
    try {
        let receiverIdObjectId = new mongoose.Types.ObjectId(receiverId);
        let requests = await Friend.find({ receiverId: receiverIdObjectId, requestStatus: 'sent' })
            .select('senderId receiverId requestStatus sentAt AcknowledgedAt')
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

export const updateFriendRequestStatus = async ({ requestId, requestStatus }) => {
    try {
        console.log('requestId, requestStatus:', { requestId, requestStatus });
        const requestIdObjectId = new mongoose.Types.ObjectId(requestId);
        await Friend.updateOne({ _id: requestIdObjectId }, { $set: { requestStatus: requestStatus, AcknowledgedAt: Date.now() } }, { upsert: true });
        return Promise.resolve(true);
    } catch (error) {
        console.log('updateFriendRequestStatus error:', error);
        return Promise.reject(error);
    }
}

export const fetchFriendsByUser = async ({ userId }) => {
    try {
        console.log('fetchFriendsByUser userId:', userId);
        let userIdObjectId = new mongoose.Types.ObjectId(userId);
        let friends = await Friend.find({
            $or: [
                { senderId: userIdObjectId, requestStatus: 'accepted' },
                { receiverId: userIdObjectId, requestStatus: 'accepted' }
            ]
        })
        .select('senderId receiverId requestStatus sentAt AcknowledgedAt')
        .populate({
            path: 'senderId receiverId',
            model: 'User',
            select: 'firstname lastname booksCount'
        })
        .exec();
        //let friendsWithBooksCount = await processFriends(friends);
        //console.log('fetchFriendsByUser:', friendsWithBooksCount);
        return Promise.resolve(friends);
    } catch (error) {
        console.log('fetchFriendsByUser error:', error);
        return Promise.reject(error);
    }
}

const processFriends = async (friends) => {
    for (let friend of friends){
        let receiverObjectId = new mongoose.Types.ObjectId(friend.receiverId._id);
        let receiverBookCounts = await BookShelfUser.find({
            userId:receiverObjectId
        }).countDocuments();
        friend['receiverBooksCount'] = receiverBookCounts;
        //newFriend.receiverBooksCount = receiverBookCounts;
        //console.log('friend.receiverId.booksCount:', newFriend.receiverBooksCount);
        //console.log('friend.receiverId:', friend.receiverId);
        console.log('friend loop:', friend);
        let senderObjectId = new mongoose.Types.ObjectId(friend.senderId._id);
        let senderBookCounts = await BookShelfUser.find({
            userId: senderObjectId
        }).countDocuments();
        if (friend.senderId) {
            friend = {...friend, senderBookCounts: senderBookCounts};
        }
        //newFriend.senderBookCounts = senderBookCounts;
        //console.log('friend:', friend);
    }
    console.log('friends:', friends);
    //let friendsWithBooksCount = await Promise.all(friends);
    //console.log('friendsWithBooksCount:', friendsWithBooksCount);
    return friends;
}