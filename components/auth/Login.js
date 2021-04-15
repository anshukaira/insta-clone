import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Dimensions, ImageBackground, TouchableOpacity } from 'react-native'
import { signIn } from '../../firebase/functions'

// import { TouchableOpacity } from 'react-native-gesture-handler'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    return (
        <View>
            <View>
                <TextInput
                    placeholder="Email"
                    placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                    underlineColorAndroid='transparent'
                    value={email}
                    onChangeText={(email) => setEmail(email)}
                />
            </View>
            <View >
                <TextInput
                    placeholder="password"
                    placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                    underlineColorAndroid='transparent'
                    value={password}
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            <View >
                <TouchableOpacity
                    onPress={() => signIn(email, password)}
                >
                    <Text style={styles.text}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Login