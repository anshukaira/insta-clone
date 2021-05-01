import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import FeedScreen from './Feed'
import ProfileScreen from '../Profile/ProfileStack'

const Stack = createStackNavigator();

export default function FeedStack() {
    return (
        <Stack.Navigator >
            <Stack.Screen name="FeedHome" component={FeedScreen} options={{ headerShown: false, title: 'Feed' }} initialParams={{ screen: 'Feed' }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} initialParams={{ screen: 'Feed' }} />
        </Stack.Navigator>
    )
}
