import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Feather } from '@expo/vector-icons';

import { signIn } from '../../firebase/functions'

// import { TouchableOpacity } from 'react-native-gesture-handler'

function Login({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm_secureTextEntry, setConfirmEntry] = useState(true);


  return (
    <View style={styles.mainContainer}>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <Text style={styles.h1}>MIRAI C</Text>
            <TextInput
              style={styles.input}
              placeholder="Email."
              onChangeText={(email) => setEmail(email)}
              underlineColorAndroid="transparent"
            />
          <View style={styles.input}>
            <TextInput
              placeholder="Password."
              secureTextEntry={confirm_secureTextEntry ? true : false}
              onChangeText={(password) => setPassword(password)}
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity
              onPress={() => setConfirmEntry(!confirm_secureTextEntry)}
            >
              {password ?
                <View>
                  {confirm_secureTextEntry ?
                    <Feather
                      name="eye-off"
                      color='#8e8e8e'
                      size={15}
                    />
                    :
                    <Feather
                      name="eye"
                      color='#8e8e8e'
                      size={15}
                    />
                  }
                </View>
                : <View></View>
              }
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginBtn}
            onPress={() => signIn(email, password)}
          >
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>


        </View>
        <View style={styles.container1}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.SignIn}>Sign up</Text>
          </TouchableOpacity>
        </View>
   </View>
  )
}

export default Login

const { width: WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create(
  {
    mainContainer: {
      height: '100%',
      width: '100%',
      flex: 1,
      backgroundColor: "#fafafa",
      alignItems: "center",
      justifyContent: "center",
    },

    container: {
      height: 300,
      width: 348,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#dbdbdb',
      backgroundColor: '#fff',
      alignItems: 'center',
      borderRadius: 1,
    },

    container1: {
      height: 63,
      width: 348,
      paddingBottom: 10,
      paddingTop: 10,
      borderWidth: 1,
      borderColor: '#dbdbdb',
      backgroundColor: '#fff',
      alignItems: 'center',
      borderRadius: 1,
      fontSize: 14,
      flexDirection: 'row',
      justifyContent: 'center',
    },

    h1: {
        margin: 10,
        fontFamily: 'montserrat',
        fontWeight: 'bold',
        fontSize: 35,
      },

    input: {
      color: '#8e8e8e',
      borderColor: '#dbdbdb',
      borderRadius: 5,
      width: 258,
      fontSize: 12,
      marginTop: 10,
      padding: 15,
      borderWidth: 0.5,
      backgroundColor: "#fafafa",
      flexDirection: 'row',
      alignItems: 'center',
    },


    SignIn: {
      color: '#0095f6',
    },

    loginBtn: {
      borderWidth: 1,
      borderRadius: 5,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
      width: 258,
    },
  }
);