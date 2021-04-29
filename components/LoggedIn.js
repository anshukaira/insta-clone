import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { subAllUser, subProtPosts, subPublicPosts, subUser } from '../firebase/subscriptions';

import HomeScreen from './Home/Home';
import CommentsScreen from './Comments/Comments'
import OptionsScreen from './Options/OptionStack';
import EditScreen from './Edit/Edit'
import AddScreen from './Add/Add'


const Stack = createStackNavigator();

function LoggedIn({ uid }) {

    useEffect(() => {
        const unsubUser = subUser(uid);
        const unsubAllUser = subAllUser();
        const unsubPubPosts = subPublicPosts();
        const unsubProtPosts = subProtPosts();
        return () => {
            console.log("Unsub from All subscribers")
            unsubUser();
            unsubAllUser();
            unsubPubPosts();
            unsubProtPosts();
        };
    }, [])

    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
<<<<<<< HEAD
            <Stack.Screen name="Comments" component={CommentScreen} />
=======
            <Stack.Screen name="Comments" component={CommentsScreen} />
>>>>>>> b5ec515... partial update till Post
            <Stack.Screen name="Options" component={OptionsScreen} />
            <Stack.Screen name="Edit" component={EditScreen} />
            <Stack.Screen name="Add" component={AddScreen} />
        </Stack.Navigator>
    )
}

export default LoggedIn
