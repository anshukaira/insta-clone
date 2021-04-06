import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        uid: null
    },
    reducers: {
        set: (state, action) => {
            state.uid = action.payload.uid;
        },
        unset: (state, action) => {
            state = {
                uid: null
            }
        }
    }
})

export const selectUser = (state) => state.user

export const { set, unset } = userSlice.actions
export default userSlice.reducer