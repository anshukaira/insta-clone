import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loaded: false
}

export const allUserSlice = createSlice({
    name: 'allUser',
    initialState,
    reducers: {
        set: (state, action) => {
            return action.payload
        },
        unset: () => initialState,
    }
})

export const selectAllUser = (state) => state.allUser

export const { set, unset } = allUserSlice.actions
export default allUserSlice.reducer