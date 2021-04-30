import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export function descriptiveText(text = '') {
    return (
        <View style={styles.descriptive}>
            <Text style={styles.smallText}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    descriptive: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    smallText: {
        fontSize: 12,
        color: 'grey'
    }
})
