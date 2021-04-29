import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import FeedScreen from './Feed'
import ProfileScreen from '../Profile/ProfileStack'
import { useSelector } from 'react-redux';
import { selectAllUser } from '../../../redux/slices/allUserSlice';

const Stack = createStackNavigator();

export default function FeedStack() {
    return (
        <Stack.Navigator >
            <Stack.Screen name="FeedHome" component={FeedScreen} options={{ headerShown: false }} initialParams={{ screen: 'Feed' }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={({ route }) => ({ headerTitle: route.params.name })} initialParams={{ screen: 'Feed' }} />
        </Stack.Navigator>
    )
}
