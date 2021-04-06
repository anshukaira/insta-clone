import React from 'react'
import { View, Button } from 'react-native'

function Landing({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button
                title="Register"
                onPress={() => navigation.navigate("Register")} />
            <Button
                title="Login"
                onPress={() => navigation.navigate("Login")} />
        </View>
    )
}

export default Landing
