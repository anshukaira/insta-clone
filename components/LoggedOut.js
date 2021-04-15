import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LandingScreen from './auth/Landing'
import LoginScreen from './auth/Login'
import RegisterScreen from './auth/Register'

const Stack = createStackNavigator();

function LoggedOut() {
    return (
        <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    )
}

export default LoggedOut
