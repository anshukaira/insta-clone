import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './Home/Home';
import CommentScreen from './Comments/Comments'
import OptionsScreen from './Options/OptionStack';
import EditScreen from './Edit/Edit'
import AddScreen from './Home/Add/Add'
import { useSelector } from 'react-redux';
import { subAlllUser, subProtPosts, subPublicPosts, subUser } from '../firebase/subscriptions';
import { selectUser } from '../redux/slices/userSlice';


const Stack = createStackNavigator();


function LoggedIn({ uid }) {
    useEffect(() => {
        const unsubUser = subUser(uid);
        const unsubAllUser = subAlllUser();
        const unsubPubPosts = subPublicPosts();
        const unsubProtPosts = subProtPosts();
        return () => {
            console.log("unsubscribing from events")
            unsubUser();
            unsubAllUser();
            unsubPubPosts();
            unsubProtPosts();
        };
    }, [])

    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Comments" component={CommentScreen} />
            <Stack.Screen name="Options" component={OptionsScreen} />
            <Stack.Screen name="Edit" component={EditScreen} />
            <Stack.Screen name="Add" component={AddScreen} />
        </Stack.Navigator>
    )
}

export default LoggedIn
