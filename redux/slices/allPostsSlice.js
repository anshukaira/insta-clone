import { createSlice } from "@reduxjs/toolkit";

const initialState = {
}

export const allPostsSlice = createSlice({
    name: 'allPosts',
    initialState,
    reducers: {
        addProtected: (state, action) => {
            let allPublic = {};
            for (const key in state) {
                if (state[key].visibility == 'PUBLIC') {
                    allPublic[key] = { ...state[key] };
                }
            }
            let allProtected = {}
            for (const key in action.payload) {
                allProtected[key] = { ...action.payload[key] }
                allProtected[key].visibility = 'PROTECTED'
            }
            let all = {
                ...allPublic,
                ...allProtected
            }
            return all
        },
        addPublic: (state, action) => {
            let allProtected = {};
            for (const key in state) {
                if (state[key].visibility == 'PROTECTED') {
                    allProtected[key] = { ...state[key] };
                }
            }
            let allPublic = {}
            for (const key in action.payload) {
                allPublic[key] = { ...action.payload[key] }
                allPublic[key].visibility = 'PUBLIC'
            }
            let all = {
                ...allProtected,
                ...allPublic
            }
            return all
        },
        unset: () => initialState,
    }
})

export const selectAllPosts = (state) => state.allPosts

export const { addPublic, addProtected, unset } = allPostsSlice.actions
export default allPostsSlice.reducer