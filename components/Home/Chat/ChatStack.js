import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ChatScreen from './ChatHome'
import Chat from './Chat'
import { useNavigation, useRoute } from '@react-navigation/core';
import { Dimensions, View } from 'react-native';


const Stack = createStackNavigator();

export default function ChatStack() {
    const route = useRoute();
    return (
        <Stack.Navigator initialRouteName={route.params.default}>
            <Stack.Screen name="ChatHome" component={ChatScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={Chat} options={{ headerShown: true }} initialParams={route.params} />
        </Stack.Navigator>
    )
}
