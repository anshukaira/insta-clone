import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, Button } from 'react-native'
import { signOut } from '../../firebase/functions'

export default function Options() {

    const navigation = useNavigation();
    const managePress = () => {
        navigation.navigate('ManagePosts');
    }

    return (
        <View>
            <Button title="Sign Out" onPress={signOut} />
            <Button title="Manage Posts" onPress={managePress} />
        </View>
    )
}
