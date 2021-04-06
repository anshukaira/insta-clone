import React, { useState } from 'react'
import { View, Button, TextInput } from 'react-native'
import { signIn } from '../../firebase/functions'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    return (
        <View>
            <TextInput
                placeholder="email"
                value={email}
                onChangeText={(email) => setEmail(email)}
            />
            <TextInput
                placeholder="password"
                value={password}
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
            />

            <Button
                onPress={() => signIn(email, password)}
                title="Sign In"
            />
        </View>
    )
}

export default Login
