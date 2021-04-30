import 'react-native-gesture-handler'; // It should be at top before any other imports
import React from 'react';
import store from './redux/store/app'
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import Main from './components/Main'
import { LogBox } from 'react-native';

enableScreens();
if (LogBox) {
  LogBox.ignoreLogs(['Setting a timer']);
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Main />
      </NavigationContainer>
    </Provider>
  );
}
