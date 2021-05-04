import 'react-native-gesture-handler'; // It should be at top before any other imports

import React,{useEffect} from 'react';
import { LogBox } from 'react-native';

import store from './redux/store/app'
import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';

import Main from './components/Main'
import { firestore } from './firebase/firebase';

enableScreens();

if (LogBox) {
  LogBox.ignoreLogs(['Setting a timer']);
}

export default function App() {

  useEffect(() => {
    firestore.enablePersistence().catch((err) => console.log(err.message))

  }, [])

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Main />
      </NavigationContainer>
    </Provider>
  );
}
