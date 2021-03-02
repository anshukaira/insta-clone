import React, { useState } from 'react'
import { Button, Text, View } from 'react-native'

import firebase from 'firebase';
import { TextInput } from 'react-native-gesture-handler';

export default function Login() {
    const [config, setConfig] = useState({
        email: '',
        password: '',
    });

    const onSignin = () => {
        const { email, password } = config;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            console.log('yo error', error)
        })
    }
    return (
        <View>
            <TextInput
                placeholder="email"
                onChangeText={(email) => setConfig({...config, email})} 
            />
            <TextInput
                placeholder="password"
                secureTextEntry={true}
                onChangeText={(password) => setConfig({...config, password})} 
            />

            <Button
                onPress={() => onSignin() }
            />

        </View>
    )
}

