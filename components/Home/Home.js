import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeedScreen from './Feed/FeedStack'
import ProfileScreen from './Profile/ProfileStack'
import DiscoverScreen from './Discover/DiscoverStack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function Home() {
    return (
        <Tab.Navigator tabBarOptions={{ showLabel: false }}>
            {stackShortner("Feed", FeedScreen, "home")}
            {stackShortner("Discover", DiscoverScreen, "image-search", { uid: "discover" })}
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
                // tabBarLabel: { name },
                tabBarIcon: () => (
                    <MaterialCommunityIcons name={icon} size={26} />
                ),
            }}
            initialParams={params}
        />
    )
}