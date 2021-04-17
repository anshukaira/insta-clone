import { useRoute } from '@react-navigation/core'
import React from 'react'
import { Text, Button, SafeAreaView } from 'react-native'
import { signOut } from '../../../firebase/functions'

export default function Profile() {
    const route = useRoute();
    return (
        <SafeAreaView>
            <Button title="Sign Out" onPress={signOut} />
            <Text>my profile {JSON.stringify(route.params)}</Text>
        </SafeAreaView>
    )
}
