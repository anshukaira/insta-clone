import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Posts from '../Post/Posts';
import ProfileScreen from '../Profile/ProfileStack';
import DiscoverScreen from './Discover';

const Stack = createStackNavigator();

export default function DiscoverStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="DiscoverHome" component={DiscoverScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Explore" component={Posts} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
    )
}
