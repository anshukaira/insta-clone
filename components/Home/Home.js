import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons'
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
        <Tab.Navigator 
            tabBarOptions={{ showLabel: false, activeBackgroundColor: 'white' }}>
            {stackShortner("Feed", FeedScreen, {active : "home-sharp", unactive: "home-outline"})}
            {stackShortner("Discover", DiscoverScreen, {active: "search", unactive: "md-search-outline"}, { uid: user.uid })}
            {stackShortner("Activity", ActivityScreen, {active : "heart", unactive : "heart-outline"})}
            {stackShortner("Chat", ChatScreen, {active : "chatbubble-ellipses", unactive : "chatbubble-outline"})}
            {stackShortner("Profile", ProfileScreen, {active : "person", unactive : "person-outline"}, { uid: user.uid, screen: 'Home' })}
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
                tabBarIcon: ({focused, name}) => (
                            <Icon name={focused ?icon.active : icon.unactive} size={26} />)
            }}
            initialParams={params}
        />
    )
}