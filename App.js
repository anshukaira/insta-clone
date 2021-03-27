import React from 'react'
import { Provider } from 'react-redux'
import Main from './comp/Main'
import store from './redux/store/app'

export default function App() {
  return (
    <Provider store={store}>
      {/* User Main.js as Entry point for App */}
      <Main />
    </Provider>
  )
}
