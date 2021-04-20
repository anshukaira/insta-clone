import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import FeedScreen from './Feed'
import ProfileScreen from '../Profile/ProfileStack'
import { useSelector } from 'react-redux';
import { selectAllUser } from '../../../redux/slices/allUserSlice';

const Stack = createStackNavigator();

export default function FeedStack() {
    const allUser = useSelector(selectAllUser);
    return (
        <Stack.Navigator >
            <Stack.Screen name="FeedHome" component={FeedScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={({ route }) => ({ headerTitle: allUser[route.params.uid].name })} />
        </Stack.Navigator>
    )
}
