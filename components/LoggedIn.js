import React from 'react'
import { Button, View } from 'react-native'
import { signOut } from '../firebase/functions'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './Home/Home';
import CommentScreen from './Comments/Comments'

const Stack = createStackNavigator();


function LoggedIn() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Comment" component={CommentScreen} />
        </Stack.Navigator>
    )
}

export default LoggedIn
