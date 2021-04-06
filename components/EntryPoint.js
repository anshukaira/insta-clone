import React, { useEffect } from 'react'

import MainScreen from './Main'
import LandingScreen from './auth/Landing'
import LoginScreen from './auth/Login'
import RegisterScreen from './auth/Register'

import { auth } from '../firebase/firebase'

import { useDispatch, useSelector } from 'react-redux'
import { selectUser, set, unset } from '../redux/slices/userSlice';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

function Main() {
    const user = useSelector(selectUser)
    const dispatch = useDispatch();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((_user) => {
            if (_user) {
                console.log(_user)
                let userData = { uid: "testing" }
                dispatch(set(userData))
            } else {
                dispatch(unset())
                console.log("Logged Out User");
            }
        })
        return unsubscribe
    }, [])

    return (
        <NavigationContainer>
            {user.uid ? LoggedIn : LoggedOut}
        </NavigationContainer>
    )
}

export default Main

const LoggedIn = (
    <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={MainScreen} />
        {/* <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation} />
        <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation} />
        <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation} /> */}
    </Stack.Navigator>
)

const LoggedOut = (
    <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
)

// Currently I am not using this but we will add animation here
// const Loading = (
//     <View style={{ flex: 1, justifyContent: 'center' }}>
//         <Text>Loading</Text>
//     </View>
// )