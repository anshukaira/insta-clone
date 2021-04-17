import { useNavigation, useRoute } from '@react-navigation/core'
import React from 'react'
import { View, Text } from 'react-native'

export default function Post({ p_id }) {
    const navigation = useNavigation();
    const openProfile = () => {
        navigation.navigate("Profile", { p_id: p_id, u_id: "test" })
    }
    return (
        <View>
            <Text onPress={openProfile} >P ID {p_id} Post Here Clicking my username takes to profile stack screen</Text>
        </View>
    )
}
