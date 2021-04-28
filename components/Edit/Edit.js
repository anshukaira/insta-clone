import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/userSlice';

export default function Edit() {

    const user = useSelector(selectUser);

    const [name, setName] = useState(user.name);
    const [about, setAbout] = useState(user.about);
    const [vis, setVis] = useState(user.vis);

    const editUserInfo = (data) => {
        console.log('data is', data);
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text>Name : </Text>
                <TextInput
                    placeholder='Nmae wa?'
                    value={name}
                    onChangeText={(name) => setName(name)}
                    style={styles.textBox}
                />
            </View>
            
            <View style={styles.inputContainer}>
                <Text >About : </Text>
                <TextInput
                    placeholder='About'
                    value={about}
                    onChangeText={(about) => setAbout(about)}
                    style={styles.textBox}
                />
            </View>
            
            <View style={styles.inputContainer}>
                <Text >Vis : </Text>
                <Text 
                    onPress={() => setVis("PROTECTED")}
                    style={vis == "PROTECTED" ? styles.greenBox : styles.box}>
                        Private
                </Text>
                <Text 
                    onPress={() => setVis("PUBLIC")}
                    style={vis == "PUBLIC" ? styles.greenBox : styles.box}>
                        Public
                </Text>
                <Text 
                    onPress={() => setVis("PRIVATE")}
                    style={vis == "PRIVATE" ? styles.greenBox : styles.box}>
                        Deactivate
                </Text>
            </View>
            
            <View styles={styles.inputContainer}>
            <TouchableOpacity
                    style={styles.button}
                    onPress={() => editUserInfo({name, vis, about})}
                >
                    <Text style={styles.text}>Save</Text>
            </TouchableOpacity>
            </View> 
        </View>
        
    )
}

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
        textBox: {
            width: 200,
            height: 48,
            borderRadius: 25,
            fontSize: 16,
            paddingLeft: 45,
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            color: 'rgba(255, 255, 255, 0.7)',
            marginHorizontal: 25
        },
        inputContainer: {
            marginTop: 10,
            flexDirection: 'row',
        },
        button: {
            width: 100,
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
        },
        box: {
            borderWidth: 1,
            borderRadius: 5,
            marginLeft: 10,
            marginRight: 10,
            padding: 5,
            alignItems: 'center'
        },
        greenBox:{
            borderWidth: 1,
            borderRadius: 5,
            marginLeft: 10,
            marginRight: 10,
            padding: 5,
            alignItems: 'center',
            backgroundColor: 'green',
            color: 'white',
        }

});