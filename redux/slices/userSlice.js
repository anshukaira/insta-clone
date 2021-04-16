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
        unset: () => initialState,
        update: (state, action) => {
            // Basically it will add whatever data is passed to it giving us flexibility to change data directly from database
            state = { ...state, ...action.payload }
        }
    }
})

export const selectUser = (state) => state.user

export const { set, unset, update } = userSlice.actions
export default userSlice.reducer