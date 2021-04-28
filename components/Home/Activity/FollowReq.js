import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { acceptFollowReq, rejectFollowReq } from '../../../firebase/functions'
import { selectAllUser } from '../../../redux/slices/allUserSlice'
import { selectUser } from '../../../redux/slices/userSlice'

export default function FollowReq() {
    const user = useSelector(selectUser)
    const allUser = useSelector(selectAllUser)
    if (user.followReq.length == 0) {
        return (
            <View>
                <Text>
                    No Follow Req Yet
                </Text>
            </View>
        )
    }
    return (
        <View>
            {user.followReq.map((item) => {
                return (
                    <Item uid={item} key={item} name={allUser[item].name} />
                )
            })}
        </View>
    )
}

function Item({ uid, name }) {
    const navigation = useNavigation();
    const acceptPress = () => {
        acceptFollowReq(uid)
    }
    const rejectPress = () => {
        rejectFollowReq(uid);
    }
    const navigateProfile = () => {
        navigation.navigate('Profile', { uid: uid, screen: 'Activity' })
    }
    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity style={styles.userbox} onPress={navigateProfile}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.uid}>{uid}</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.yes} onPress={acceptPress}>
                    <Text>YES</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.no} onPress={rejectPress}>
                    <Text>NO</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userbox: {
        flex: 4,
        flexDirection: 'column',
        padding: 10,
    },
    name: {
        fontSize: 24,
        textAlign: 'left'
    },
    uid: {
        fontSize: 12,
        textAlign: 'left'
    },
    buttonContainer: {
        flex: 1,
        padding: 10
    },
    yes: {
        borderWidth: 1,
        padding: 5,
        backgroundColor: 'green',
        color: 'white'
    },
    no: {
        borderWidth: 1,
        padding: 5,
        backgroundColor: 'red',
        color: 'white'
    }
})