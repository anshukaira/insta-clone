import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    uid: null,
    loaded: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        set: (state, action) => {
            let data = {
                loaded: true,
                ...action.payload
            }
            return data
        },
        unset: () => initialState,
    }
})

export const selectUser = (state) => state.user

export const { set, unset } = userSlice.actions
export default userSlice.reducer