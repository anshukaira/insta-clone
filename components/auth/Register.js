import React, { useState } from 'react'
import { View, Button, TextInput } from 'react-native'
import { signUp } from '../../firebase/functions'

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    return (
        <View>
            <TextInput
                placeholder="name"
                value={name}
                onChangeText={(name) => setName(name)}
            />
            <TextInput
                placeholder="email"
                value={email}
                onChangeText={(email) => setEmail(email)}
            />
            <TextInput
                placeholder="password"
                secureTextEntry={true}
                value={password}
                onChangeText={(password) => setPassword(password)}
            />

            <Button
                onPress={() => signUp(name, email, password)}
                title="Sign Up"
            />
        </View>
    )
}

export default Register
