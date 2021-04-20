import { createSlice } from "@reduxjs/toolkit";

const initialState = {
}

export const cachedPostsSlice = createSlice({
    name: 'cachedPosts',
    initialState,
    reducers: {
        set: (state, action) => {
            return action.payload
        },
        addPost: (state, action) => {
            state[action.payload.key] = action.payload.content
        },
        unset: () => initialState,
    }
})

export const selectCachedPosts = (state) => state.cachedPosts

export const { set, unset, addPost } = cachedPostsSlice.actions
export default cachedPostsSlice.reducer