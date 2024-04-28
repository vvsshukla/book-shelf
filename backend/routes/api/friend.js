import { sendFriendRequest, getFriendRequests, updateFriendRequestStatus} from "../../controllers/friend.js";

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
        res.json({success: false, message: 'Error in fetching friend requests.', error: error});
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