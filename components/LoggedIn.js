import React from 'react'
import { Button } from 'react-native'
import { signOut } from '../firebase/functions'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeedScreen from './main/Feed/Feed'

const Tab = createMaterialBottomTabNavigator();

function LoggedIn() {
    return (
        <>
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
                <Tab.Screen
                    name="Feed"
                    component={FeedScreen}
                    options={{
                        tabBarLabel: 'Feed',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Feed2"
                    component={FeedScreen}
                    options={{
                        tabBarLabel: 'Feed',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                    }}
                />
            </Tab.Navigator>
            <Button title="Sign Out" onPress={signOut} />
        </>
    )
}

export default LoggedIn
