export const updateProgress = (progress) => {
    console.log('progress:', progress);
    return {
        type: "UPDATE_PROGRESS",
        progress
    }
}