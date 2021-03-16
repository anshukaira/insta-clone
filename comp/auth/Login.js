import React, { useState } from 'react'
import { Button, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { signIn } from '../../firebase/functions';

export default function Login() {
    const [config, setConfig] = useState({
        email: '',
        password: '',
    });

    return (
        <View>
            <TextInput
                placeholder="email"
                onChangeText={(email) => setConfig({ ...config, email })}
            />
            <TextInput
                placeholder="password"
                secureTextEntry={true}
                onChangeText={(password) => setConfig({ ...config, password })}
            />

            <Button
                title="Login"
                onPress={() => signIn(config.email, config.password)}
            />

        </View>
    )
}

