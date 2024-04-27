import { sendFriendRequest } from "../../controllers/friend.js";
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