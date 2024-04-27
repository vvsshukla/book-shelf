export const addFriend = (receiverId) => {
    return {
        type: 'ADD_FRIEND',
        receiverId
    }
}