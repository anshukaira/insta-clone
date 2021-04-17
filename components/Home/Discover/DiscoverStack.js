import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import DiscoverScreen from './Discover';

const Stack = createStackNavigator();

export default function DiscoverStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="DiscoverHome" component={DiscoverScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}
