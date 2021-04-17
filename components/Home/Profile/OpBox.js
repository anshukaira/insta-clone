import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export function OwnBox({ uid }) {
    const navigation = useNavigation();

    const gotoEdit = () => {
        navigation.navigate("Edit")
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={gotoEdit} style={[styles.box, { flex: 6 }]}>
                <Text>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.box, { flex: 6 }]}>
                <Text>Saved</Text>
            </TouchableOpacity>
        </View>
    )
}

export function OtherBox({ uid }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.box, { flex: 6 }]}>
                <Text>Following</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.box, { flex: 6 }]}>
                <Text>Message</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        alignItems: 'center'
    },
    box: {
        borderWidth: 1,
        borderRadius: 5,
        marginLeft: 10,
        marginRight: 10,
        padding: 5,
        alignItems: 'center'
    }
})