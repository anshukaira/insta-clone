import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from './Profile'
import SavedScreen from '../Saved/SavedStack'
import { useRoute } from '@react-navigation/core';
import PostsScreen from '../Post/Posts';

const Stack = createStackNavigator();

export default function ProfileStack() {
    const route = useRoute();
    return (
        <Stack.Navigator initialRouteName="ProfileHome">
            <Stack.Screen name="ProfileHome" component={ProfileScreen} options={{ headerShown: false }} initialParams={route.params} />
            <Stack.Screen name="Saved" component={SavedScreen} />
            <Stack.Screen name="Posts" component={PostsScreen} />
        </Stack.Navigator>
    )
}
