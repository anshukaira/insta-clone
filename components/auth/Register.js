import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, ImageBackground, Dimensions } from 'react-native'
import { signUp } from '../../firebase/functions'

import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native-gesture-handler'

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    return (
        <View>
            <View style={styles.inputContainer}>
                <Icon
                    name={'ios-person-outline'}
                    size={26}
                    color={'rgba(255, 255, 255, 0.7)'}
                    style={styles.inputIcon}
                />

                <TextInput
                    placeholder='Username'
                    placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                    underlineColorAndroid='transparent'
                    value={name}
                    onChangeText={(name) => setName(name)}
                    style={styles.textbox}
                />
            </View>
            <View style={styles.inputContainer}>
                <Icon
                    name='ios-mail-outline'
                    size={26}
                    color={'rgba(255, 255, 255, 0.7)'}
                    style={styles.inputIcon}
                />
                <TextInput
                    placeholder="email"
                    placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                    underlineColorAndroid='transparent'
                    value={email}
                    onChangeText={(email) => setEmail(email)}
                    style={styles.textbox}
                />
            </View>
            <View style={styles.inputContainer}>
                <Icon
                    name={'ios-key-outline'}
                    size={26}
                    color={'rgba(255, 255, 255, 0.7)'}
                    style={styles.inputIcon}
                />
                <TextInput
                    placeholder="password"
                    placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                    underlineColorAndroid='transparent'
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                    style={styles.textbox}
                />
            </View>
            <View style={styles.inputContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={signUp(name, email, password)}
                >
                    <Text style={styles.text}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default Register

const { width: WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            width: null,
            height: null,
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputContainer: {
            marginTop: 10,

        },
        textbox: {
            width: WIDTH - 55,
            height: 48,
            borderRadius: 25,
            fontSize: 16,
            paddingLeft: 45,
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            color: 'rgba(255, 255, 255, 0.7)',
            marginHorizontal: 25
        },
        inputIcon: {
            position: "absolute",
            top: 8,
            left: 37,
        },
        button: {
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

//color palatte for our app - #e3c3ca #8e9bbb #fbf6e4 #9a747b #c3949d #b1abc1 #fae0d7 #d3a4a3 #e9e1ed #ad8484             //'#ad8491',
