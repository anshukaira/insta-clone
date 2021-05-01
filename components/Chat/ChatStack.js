import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ChatScreen from './ChatHome'
import Chat from './Chat'
import { useRoute } from '@react-navigation/core';


const Stack = createStackNavigator();

export default function ChatStack() {
    const route = useRoute();
    return (
        <Stack.Navigator initialRouteName={route.params.default}>
            <Stack.Screen name="ChatHome" component={ChatScreen} />
            <Stack.Screen name="Chat" component={Chat} options={({ route }) => ({ headerTitle: route.params.header || "CHAT HEADER" })} />
        </Stack.Navigator>
    )
}
