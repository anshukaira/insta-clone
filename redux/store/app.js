import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../slices/userSlice'

export default configureStore({
    reducer: {
        // enter reducers here from diiferent components
        user: userReducer
    }
})