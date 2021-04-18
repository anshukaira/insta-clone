import React from 'react'
import { View, Button } from 'react-native'
import { signOut } from '../../firebase/functions'

export default function Options() {
    return (
        <View>
            <Button title="Sign Out" onPress={signOut} />
        </View>
    )
}
