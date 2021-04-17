import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeedScreen from './Feed/FeedStack'
import ProfileScreen from './Profile/ProfileStack'

const Tab = createMaterialBottomTabNavigator();

export default function Home() {
    return (
        <Tab.Navigator initialRouteName="Feed" labeled={false}>
            {stackShortner("Feed", FeedScreen, "home")}
            {stackShortner("Profile", ProfileScreen, "account-circle", { uid: "me" })}
        </Tab.Navigator>
    )
}

const stackShortner = (name, component, icon, params = undefined) => {
    return (
        <Tab.Screen
            name={name}
            component={component}
            options={{
                tabBarLabel: { name },
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name={icon} color={color} size={26} />
                ),
            }}
            initialParams={params}
        />
    )
}