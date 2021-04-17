import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from './Profile'
import { useRoute } from '@react-navigation/core';

const Stack = createStackNavigator();

export default function ProfileStack() {
    const route = useRoute();
    console.log("pstack", route)
    return (
        <Stack.Navigator initialRouteName="Profile">
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} initialParams={route.params} />
        </Stack.Navigator>
    )
}
