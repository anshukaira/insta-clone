import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loaded: false
}

export const allPostsSlice = createSlice({
    name: 'allPosts',
    initialState,
    reducers: {
        set: (state,action)=>{
            return action.payload
        },
        unset: () => initialState,
    }
})

export const selectAllPosts = (state) => state.allPosts

export const { set, unset } = allPostsSlice.actions
export default allPostsSlice.reducer