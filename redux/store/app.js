import { configureStore } from '@reduxjs/toolkit'
import allPostsReducer from '../slices/allPostsSlice'
import allUserReducer from '../slices/allUserSlice'
import cachedPostsReducer from '../slices/cachedPosts'
import protPostsReducer from '../slices/protPostsSlice'
import pubPostsReducer from '../slices/pubPostsSlice'
import userReducer from '../slices/userSlice'

export default configureStore({
    reducer: {
        // enter reducers here from diiferent components
        user: userReducer,
        allUser: allUserReducer,
        pubPosts: pubPostsReducer,
        protPosts: protPostsReducer,
        cachedPosts: cachedPostsReducer,
        allPosts: allPostsReducer
    }
})