import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './Auth/Login'
import RegisterScreen from './Auth/Register'

const Stack = createStackNavigator();

function LoggedOut() {
    return (
        <Stack.Navigator initialRouteName="Login"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    )
}

export default LoggedOut
