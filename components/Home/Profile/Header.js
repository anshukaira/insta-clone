import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import { theme } from '../../Style/Constants'
import Icon from 'react-native-vector-icons/Ionicons'

export default function Header({ uid }) {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Icon name="md-lock-closed-outline" style={styles.icon} />
                <Text style={styles.text}> {uid}</Text>
            </View>
            
            <View style={styles.row}>

                <Icon name="add-circle-outline" onPress={() => navigation.navigate("Add")} style={styles.iconright}/>
                <Icon name="md-options" onPress={() => navigation.navigate("Options")} style={styles.iconright}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: theme.lightbg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
        height: 50,
        top: StatusBar.currentHeight,
        left: 0,
        zIndex: 999,
        width: '100%',
    },
    text: {
        color: theme.lightfont,
        fontSize: 18,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row'
    },
    iconright: {
        color: theme.lightfont,
        fontSize: 24,
        marginLeft: 5,
        padding: 5,
    },
    icon: {
        fontSize: 20,
        marginRight: 8,
    }
})