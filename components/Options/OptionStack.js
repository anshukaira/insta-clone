import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import OptionsScreen from './Options'
import ManageScreen from './Manage'

const Stack = createStackNavigator();

export default function OptionStack() {
    return (
        <Stack.Navigator initialRouteName="OptionHome">
            <Stack.Screen name="OptionHome" component={OptionsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ManagePosts" component={ManageScreen} />
        </Stack.Navigator>
    )
}
