import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import { theme } from '../../Style/Constants'
import Icon from 'react-native-vector-icons/Ionicons'
import { selectUser } from '../../../redux/slices/userSlice'
import { useSelector } from 'react-redux'

export default function Header({ uid = "xxx" }) {
    const navigation = useNavigation();
    const user = useSelector(selectUser);

    const openProfile = () => {
        navigation.navigate("Profile", { uid: user.uid, screen: 'Chat' })
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Icon name="person" style={styles.icon} />
                <Text style={styles.text} onPress={openProfile}> {uid}</Text>
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
        paddingLeft: 20,
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