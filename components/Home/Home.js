import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import FeedScreen from './Feed/FeedStack'
import ProfileScreen from './Profile/ProfileStack'
import DiscoverScreen from './Discover/DiscoverStack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from './Chat/ChatStack'
import ActivityScreen from './Activity/ActivityStack'
import { useRoute } from '@react-navigation/core'

const Tab = createBottomTabNavigator();

export default function Home() {

    const route = useRoute()

    return (
        <Tab.Navigator
            tabBarOptions={{ showLabel: false, activeBackgroundColor: 'white' }} initialRouteName="Feed">
            {stackShortner("Feed", FeedScreen, { active: "home-sharp", unactive: "home-outline" })}
            {stackShortner("Discover", DiscoverScreen, { active: "search", unactive: "md-search-outline" }, { uid: route.params.uid })}
            {stackShortner("Activity", ActivityScreen, { active: "heart", unactive: "heart-outline" })}
            {stackShortner("Chat", ChatScreen, { active: "chatbubble-ellipses", unactive: "chatbubble-outline" })}
            {stackShortner("Profile", ProfileScreen, { active: "person", unactive: "person-outline" }, { uid: route.params.uid })}
        </Tab.Navigator>
    )
}

const stackShortner = (name, component, icon, params = {}) => {
    const paramsModified = {
        ...params,
        screen: 'Home'
    }
    return (
        <Tab.Screen
            name={name}
            component={component}
            options={{
                tabBarIcon: ({ focused }) => (
                    <Icon name={focused ? icon.active : icon.unactive} size={26} />)
            }}
            initialParams={paramsModified}
        />
    )
}