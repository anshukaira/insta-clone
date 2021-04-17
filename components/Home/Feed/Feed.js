import React from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import Posts from '../Post/Posts'
import Header from './Header'
import { theme } from '../../Style/Constants'


export default function Feed() {
    return (
        <View style={styles.container}>
            <Header />
            <Posts />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.lightbg,
        color: theme.lightfont,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingTop: StatusBar.currentHeight,
    }
})
