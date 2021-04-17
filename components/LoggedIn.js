import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './Home/Home';
import CommentScreen from './Comments/Comments'
import OptionsScreen from './Options/Options';
import EditScreen from './Edit/Edit'
import AddScreen from './Home/Add/Add'

const Stack = createStackNavigator();


function LoggedIn() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Comment" component={CommentScreen} />
            <Stack.Screen name="Options" component={OptionsScreen} />
            <Stack.Screen name="Edit" component={EditScreen} />
            <Stack.Screen name="Add" component={AddScreen} />
        </Stack.Navigator>
    )
}

export default LoggedIn
