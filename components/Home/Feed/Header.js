import React from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import { theme } from '../../Style/Constants'

export default function Header() {
    return (
        <View style={styles.container}>
            <Text style={styles.iconleft}>Icon</Text>
            <Text style={styles.text}>MIRAI</Text>
            <Text style={styles.iconright}>M Icon</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: theme.lightbg,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        alignItems: 'center',
        height: 50,
        top: StatusBar.currentHeight,
        left: 0,
        zIndex: 999,
        width: '100%'
    },
    text: {
        color: theme.lightfont,
        fontSize: 24,
    },
    iconleft: {
        position: 'absolute',
        left: 20,
        color: theme.lightfont,
        fontSize: 24
    },
    iconright: {
        position: 'absolute',
        right: 20,
        color: theme.lightfont,
        fontSize: 24
    }
})