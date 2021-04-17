import React from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import { theme } from '../../Style/Constants'

export default function Header() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Icon 1</Text>
            <Text style={styles.text}>MIRAI</Text>
            <Text style={styles.text}>Message Icon</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: theme.darkbg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
        height: 50,
        top: StatusBar.currentHeight,
        left: 0,
        zIndex: 999,
        width: '100%'
    },
    text: {
        color: theme.darkfont,
        fontSize: 24
    }
})