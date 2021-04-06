import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    uid: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        set: (state, action) => {
            state.uid = action.payload.uid;
        },
        unset: (state) => initialState,
    }
})

export const selectUser = (state) => state.user

export const { set, unset } = userSlice.actions
export default userSlice.reducer