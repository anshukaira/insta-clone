import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loaded: false
}

export const pubPostsSlice = createSlice({
    name: 'pubPosts',
    initialState,
    reducers: {
        set: (state, action) => {
            return action.payload
        },
        unset: () => initialState,
    }
})

export const selectPubPosts = (state) => state.pubPosts

export const { set, unset } = pubPostsSlice.actions
export default pubPostsSlice.reducer