import React from 'react'
import { View, Text, Button } from 'react-native'
import { signOut } from '../../firebase/functions'

export default function Feed() {
    return (
        <View>
            <Text>
                Profile damn!!
                <Button onPress={signOut} title="Sign Out" />
            </Text>
        </View>
    )
}
