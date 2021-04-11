import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Dimensions, ImageBackground } from 'react-native'
import { signIn } from '../../firebase/functions'

import bg from '../../assets/bg.jpg'
import { TouchableOpacity } from 'react-native-gesture-handler'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    return (
        <ImageBackground source={bg} style={styles.container}>
        <View style={styles.inputContainer}>
            <TextInput
                placeholder="Email"
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
                value={email}
                onChangeText={(email) => setEmail(email)}
                style={styles.textbox}
            />
        </View>
        <View style={styles.inputContainer}>
            <TextInput
                placeholder="password"
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                underlineColorAndroid='transparent'
                value={password}
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                style={styles.textbox}
            />            
        </View>
        <View style={styles.inputContainer}>
            <TouchableOpacity
                style={styles.button}
                onPress={signIn(email, password)}
            >
                <Text style={styles.text}>Sign In</Text>
            </TouchableOpacity>
        </View>
        </ImageBackground>
    )
}

export default Login

const {width: WIDTH}  = Dimensions.get('window');

const styles = StyleSheet.create(
    {
        container : {
            flex : 1,
            width: null,
            height: null,
            alignItems: 'center',
            justifyContent: 'center',            
        },
        inputContainer : {
            marginTop: 10,

        },
        textbox : {
            width: WIDTH - 55,
            height: 48,
            borderRadius: 25,
            fontSize: 16,
            paddingLeft: 45,
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            color: 'rgba(255, 255, 255, 0.7)',
            marginHorizontal: 25
        },
        inputIcon : {
            position: "absolute",
            top: 8,
            left: 37,
        },
        button : {
            width: WIDTH - 55,
            height: 48,
            borderRadius: 25,
            backgroundColor: '#8e96bb',
            justifyContent: 'center',
            marginTop: 20
        },
        text: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 16,
            textAlign: 'center'
        }
    }
);