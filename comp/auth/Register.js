import React, { useState } from 'react'
import { Button, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { signUp } from '../../firebase/functions';

export default function Register() {
    const [config, setConfig] = useState({
        email: '',
        password: '',
        name: ''
    });

    return (
        <View>
            <TextInput
                placeholder="name"
                onChangeText={(name) => setConfig({ ...config, name })}
            />
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
                title="Register"
                onPress={() => signUp(config.name, config.email, config.password)
                }
            />

        </View>
    )
}

