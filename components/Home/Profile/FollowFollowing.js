import React from 'react'
import { View, Text } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

const Tab = createMaterialTopTabNavigator();

export default function FollowFollowing() {
    return (
        <Tab.Navigator
            initialLayout={{ width: Dimensions.get('window').width }}
            style={{ flex: 1 }}
            tabBarOptions={{ showLabel: false, showIcon: true }}
        >
            <Tab.Screen
                name="User | Posts"
                component={Normal}
                options={{
                    tabBarIcon: () => (
                        <Icon name="grid-outline" size={26} />)
                }}
                initialParams={{ uid: user.uid }} />
            <Tab.Screen
                name="User | Posts"
                component={Normal}
                options={{
                    tabBarIcon: () => (
                        <Icon name="grid-outline" size={26} />)
                }}
                initialParams={{ uid: user.uid }} />
        </Tab.Navigator>
    )
}
