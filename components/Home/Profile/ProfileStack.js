import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from './Profile'
import { useRoute } from '@react-navigation/core';

const Stack = createStackNavigator();

export default function ProfileStack() {
    const route = useRoute();
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfileHome" component={ProfileScreen} options={{ headerShown: false }} initialParams={route.params} />
        </Stack.Navigator>
    )
}
