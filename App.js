import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { auth } from './firebase/firebase';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

import LandingScreen from './comp/auth/Landing';
import RegisterScreen from './comp/auth/Register';
import LoginScreen from './comp/auth/Login'
import MainScreen from './comp/Main';
import AddScreen from './comp/main/Add'

const store = createStore(rootReducer, applyMiddleware(thunk))



const Stack = createStackNavigator();
export default function App() {

  const [loaded, setloaded] = useState(false);
  const [loggedIn, setloggedIn] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user)
        setloggedIn(true);
      else
        setloggedIn(false);
      setloaded(true);
    })
  }, [loaded, loggedIn])

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>
          Loading
      </Text>
      </View>
    )
  }

  if (!loggedIn) {
    return (<NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>);
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Add"
            component={AddScreen}
          />
        </Stack.Navigator >
      </NavigationContainer>
    </Provider>
  );
}
