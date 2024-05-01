import { sendFriendRequest, getFriendRequests, updateFriendRequestStatus, fetchFriendsByUser} from "../../controllers/friend.js";

export const addFriend = async (req, res) => {
    try {
        let {senderId, receiverId} = req.body;
        let request = await sendFriendRequest({senderId, receiverId});
        res.json({success: true, message:'Request sent successfully.', request});
    } catch (error) {
        console.log('Error in sendFriendRequest:', error);
        res.json({success: false, message: 'Unable to send request.', error: error});
    }
}

export const friendRequests = async (req, res) => {
    try {
        let {receiverId} = req.body;
        let requests = await getFriendRequests({receiverId});
        res.json({success: true, requests});
    } catch (error) {
        console.log('Error in friendRequests:', error);
        res.json({success: false, message:'Please try again. Something went wrong.', error: error});
    }
}

export const acknowledgeFriendRequest = async (req, res) => {
    try {
        console.log('req:', req.body);
        let {requestId, requestStatus} = req.body;
        await updateFriendRequestStatus({requestId, requestStatus});
        res.status(200).json({success:true});
    } catch (error) {
        console.log('Error in acknowledgeFriendRequest:', error);
    }
}

export const fetchFriends = async (req, res) => {
    try {
        console.log('fetchFriends req:', req.body);
        let {userId} = req.body;
        let friends = await fetchFriendsByUser({userId});
        res.status(200).json({success:true, friends});
    } catch (error) {
        console.log('Error while fetching friends:', error);
        res.json({success: false, message:'Please try again. Something went wrong.'})
    }
}