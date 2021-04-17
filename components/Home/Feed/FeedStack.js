import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import FeedScreen from './Feed'
import ProfileScreen from '../Profile/ProfileStack'

const Stack = createStackNavigator();

export default function FeedStack() {
    return (
        <Stack.Navigator >
            <Stack.Screen name="FeedHome" component={FeedScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
    )
}
