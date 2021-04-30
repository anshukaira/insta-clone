import { createSlice } from "@reduxjs/toolkit";
import { POST_VISIBILITY } from "../../components/CONSTANTS";

const initialState = {
    loaded: false
}

export const allPostsSlice = createSlice({
    name: 'allPosts',
    initialState,
    reducers: {
        addProtected: (state, action) => {
            let allPublic = {};
            for (const key in state) {
                if (state[key].visibility == POST_VISIBILITY.PUBLIC) {
                    allPublic[key] = { ...state[key] };
                }
            }
            let allProtected = {}
            for (const key in action.payload) {
                allProtected[key] = { ...action.payload[key] }
                allProtected[key].visibility = POST_VISIBILITY.PROTECTED
            }
            let all = {
                loaded: true,
                ...allPublic,
                ...allProtected
            }
            return all
        },
        addPublic: (state, action) => {
            let allProtected = {};
            for (const key in state) {
                if (state[key].visibility == POST_VISIBILITY.PROTECTED) {
                    allProtected[key] = { ...state[key] };
                }
            }
            let allPublic = {}
            for (const key in action.payload) {
                allPublic[key] = { ...action.payload[key] }
                allPublic[key].visibility = POST_VISIBILITY.PUBLIC
            }
            let all = {
                loaded: true,
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