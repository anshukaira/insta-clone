import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import { theme } from '../../Style/Constants'

export default function Header({ uid }) {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>User: {uid}</Text>
            <View style={styles.right}>
                <Text onPress={() => navigation.navigate("Add")} style={styles.iconright}>ADD</Text>
                <Text onPress={() => navigation.navigate("Options")} style={styles.iconright}>X</Text>
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
        borderBottomWidth: 1
    },
    text: {
        color: theme.lightfont,
        fontSize: 18,
    },
    right: {
        flexDirection: 'row'
    },
    iconright: {
        color: theme.lightfont,
        fontSize: 18,
        marginLeft: 5,
        padding: 5,
        borderWidth: 1
    }
})