import React from 'react'
import { View, Text, Button } from 'react-native'
import { signOut } from '../../firebase/functions'

function Profile() {
    return (
        <View>
            <Text>
            Profile
            </Text>
            <Button
                onPress={() => signOut()}
                title="Sign Out"
            />
        </View>
    )
}

export default Profile
