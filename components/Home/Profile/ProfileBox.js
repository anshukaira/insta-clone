import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function ProfileBox({ style, uid }) {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.details}>
                <DPContainer uri={"Not Now"} />
                <CountBox count={123} text="Posts" />
                <CountBox count={123} text="Followers" />
                <CountBox count={123} text="Following" />
            </View>
            <View style={styles.content}>
                <Text style={{ fontSize: 24 }}>Its Me {uid}</Text>
                <Text style={{ fontSize: 20 }}>About me</Text>
            </View>
        </View>
    )
}

function DPContainer({ uri }) {
    return (
        <View style={styles.dpshape}>
        </View>
    )
}

function CountBox({ count, text }) {
    return (
        <View style={styles.countbox}>
            <Text style={{ fontSize: 24 }}>{count}</Text>
            <Text style={{ fontSize: 14 }}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        flexDirection: 'column',
    },
    details: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center'
    },
    dpshape: {
        height: 80,
        width: 80,
        borderRadius: 40,
        backgroundColor: 'green',
        marginRight: 30
    },
    countbox: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20
    },
    content: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
    }
})