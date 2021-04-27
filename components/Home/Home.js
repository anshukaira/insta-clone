import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeedScreen from './Feed/FeedStack'
import ProfileScreen from './Profile/ProfileStack'
import DiscoverScreen from './Discover/DiscoverStack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/userSlice';
import ChatScreen from './Chat/ChatStack'
import ActivityScreen from './Activity/ActivityStack'

const Tab = createBottomTabNavigator();

export default function Home() {
    const user = useSelector(selectUser);
    return (
        <Tab.Navigator tabBarOptions={{ showLabel: false, activeBackgroundColor: 'blue' }}>
            {stackShortner("Feed", FeedScreen, "home")}
            {stackShortner("Discover", DiscoverScreen, "image-search", { uid: user.uid })}
            {stackShortner("Activity", ActivityScreen, "account-circle")}
            {stackShortner("Chat", ChatScreen, "account-circle")}
            {stackShortner("Profile", ProfileScreen, "account-circle", { uid: user.uid, screen: 'Home' })}
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