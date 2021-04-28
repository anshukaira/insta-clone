import React from 'react'
import { View, Dimensions, SafeAreaView, StatusBar } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import FollowReq from './FollowReq'
import Log from './Log'
import PendingReq from './PendingReq'
const Tab = createMaterialTopTabNavigator();

export default function Activity() {
    return (
        <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
            <Tab.Navigator initialLayout={{ width: Dimensions.get('window').width }} style={{ flex: 1 }}>
                <Tab.Screen name="Log" component={Log} />
                <Tab.Screen name="Follow Request" component={FollowReq} />
                <Tab.Screen name="Pending Request" component={PendingReq} />
            </Tab.Navigator>
        </SafeAreaView>
    )
}
