import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

// Navigations
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Landing from './auth/Landing'
import Login from './auth/Login'
import Register from './auth/Register'
import Add from './main/Add'
import Feed from './main/Feed'
import Profile from './main/Profile'


// Datatbase related imports
import { auth } from '../firebase/firebase'
import { getUserInfo } from '../firebase/functions'

// Store related imports
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, set, unset, update } from '../redux/slices/userSlice'


const Stack = createStackNavigator();

function Main() {

    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                dispatch(set({
                    uid: currentUser.uid
                }))
                dispatch(update(getUserInfo(currentUser.uid)))
                console.log("User Logged In")
            } else {
                dispatch(unset())
                console.log("User Logged Out")
            }
            if (!loaded)
                setLoaded(true);
        })
        console.log("Auth Subscribed")
        return () => {
            console.log("Auth Unsubscribed")
            return unsubscribe
        }
    }, [])

    const Loading = (
        <View>
            <Text>
                Loading..
            </Text>
        </View>
    )

    const LoggedOut = (
        <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
                name="Landing"
                component={Landing}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={Register}
            />
            <Stack.Screen
                name="Login"
                component={Login}
            />
        </Stack.Navigator>
    )

    const LoggedIn = (
        <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
                name="Main"
                component={Landing}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Add"
                component={Add}
            />
            <Stack.Screen
                name="Register"
                component={Register}
            />
            <Stack.Screen
                name="Login"
                component={Login}
            />
        </Stack.Navigator >
    )

    return (
        <NavigationContainer>
            {loaded ? user ? LoggedIn : LoggedOut : Loading}
        </NavigationContainer>
    )
}

export default Main
