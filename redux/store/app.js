import { configureStore } from '@reduxjs/toolkit'
import allPostsReducer from '../slices/allPostsSlice'
import allUserReducer from '../slices/allUserSlice'
import userReducer from '../slices/userSlice'

export default configureStore({
    reducer: {
        // enter reducers here from diiferent components
        user: userReducer,
        allUser: allUserReducer,
        allPosts: allPostsReducer
    }
})