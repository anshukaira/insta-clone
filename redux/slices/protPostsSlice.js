import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loaded: false
}

export const protPostsSlice = createSlice({
    name: 'protPosts',
    initialState,
    reducers: {
        set: (state, action) => {
            return action.payload
        },
        unset: () => initialState,
    }
})

export const selectProtPosts = (state) => state.protPosts

export const { set, unset } = protPostsSlice.actions
export default protPostsSlice.reducer