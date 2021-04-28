import React from 'react'
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'


function Landing({ navigation }) {
    return (
        <View>
            <View style={styles.inputContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Register")}
                >
                    <Text style={styles.text}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.text}>Log In</Text>
                </TouchableOpacity>
            </View>
        </View>


    )
}

export default Landing

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