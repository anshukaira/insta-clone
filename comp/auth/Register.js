import React, { useState } from 'react'
import { Button, Text, View } from 'react-native'

import { auth, firestore } from '../../firebase/firebase';
import { TextInput } from 'react-native-gesture-handler';

export default function Register() {
    const [config, setConfig] = useState({
        email: '',
        password: '',
        name: ''
    });

    const onSignup = () => {
        const { email, password, name } = config;
        auth.createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firestore.collection("users")
                    .doc(auth.currentUser.uid)
                    .set({
                        name,
                        email
                    })
                console.log(result)
            })
            .catch((error) => {
                console.log('yo error', error)
            })
    }
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
                onPress={() => onSignup()
                }
            />

        </View>
    )
}

