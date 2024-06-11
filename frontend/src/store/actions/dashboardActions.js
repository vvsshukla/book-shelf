export const updateProgress = (progress, bookId, tag) => {
    return {
        type: "UPDATE_PROGRESS",
        progress,
        bookId,
        tag
    }
}

export const resetProgress = () => {
    return {
        type:'RESET_PROGRESS'
    }
}

export const setProfileImage = (profileImage) => {
    return {
        type: "SET_PROFILE_IMAGE",
        profileImage
    }
}