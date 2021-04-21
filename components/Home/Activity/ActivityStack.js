import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../Profile/ProfileStack'
import ActivityScreen from './Activity'
import { useSelector } from 'react-redux';
import { selectAllUser } from '../../../redux/slices/allUserSlice';

const Stack = createStackNavigator();

export default function ActivityStack() {
    const allUser = useSelector(selectAllUser);
    return (
        <Stack.Navigator>
            <Stack.Screen name="ActivityHome" component={ActivityScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={({ route }) => ({ headerTitle: allUser[route.params.uid].name })} />
        </Stack.Navigator>
    )
}
