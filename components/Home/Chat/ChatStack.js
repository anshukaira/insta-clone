import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ChatScreen from './ChatHome'
import Chat from './Chat'


const Stack = createStackNavigator();

export default function ChatStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ChatHome" component={ChatScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={Chat} options={({ route }) => ({ headerTitle: route.params.header || "CHAT HEADER" })} />
        </Stack.Navigator>
    )
}
