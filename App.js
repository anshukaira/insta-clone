import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import * as firebase from 'firebase';

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

//TODO: move these variables to env file
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyD8B2M-f-hOibygVBfvmHv0aizOt6JnkA4",
  authDomain: "insta-c-18f08.firebaseapp.com",
  projectId: "insta-c-18f08",
  storageBucket: "insta-c-18f08.appspot.com",
  messagingSenderId: "1900416127",
  appId: "1:1900416127:web:418e0871c52fdffdd1834a",
  measurementId: "G-7PDS937357"
};

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig);
}
const Stack = createStackNavigator();
export default function App() {

  const [loaded, setloaded] = useState(false);
  const [loggedIn, setloggedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        setloggedIn(false);
      }else{
        setloggedIn(true);
      }
      setloaded(true);
    })
  }, [loaded, loggedIn])

  if(!loaded){
    return(
    <View style={{flex : 1, justifyContent: 'center'}}>
      <Text>
        Loading
      </Text>
    </View>
  )}
  
  if(!loggedIn){
    return(<NavigationContainer>
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

    return(
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
