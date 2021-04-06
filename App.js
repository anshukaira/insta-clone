import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store/app'
import EntryPoint from './components/EntryPoint'

export default function App() {
  return (
    <Provider store={store}>
      <EntryPoint />
    </Provider>
  );
}
