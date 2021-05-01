import React from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import { theme } from '../../Style/Constants'
import Icon from 'react-native-vector-icons/Ionicons'

export default function Header() {
    return (
        <View style={styles.container}>
            <Icon
                name="add-circle-sharp"
                style={styles.iconleft} />
            <Text style={styles.text}>MIRAI~C</Text>
            <Icon
                name="md-chatbubble-ellipses-sharp"
                style={styles.iconright} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: theme.lightHeader,
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
        fontFamily: 'monospace',
        fontWeight: 'bold',
    },
    iconleft: {
        position: 'absolute',
        left: 20,
        color: theme.lightfont,
        fontSize: 28,
    },
    iconright: {
        position: 'absolute',
        right: 20,
        color: theme.lightfont,
        fontSize: 24,
    }
})