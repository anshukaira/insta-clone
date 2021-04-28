import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { unsendFollowReq } from '../../../firebase/functions'
import { selectAllUser } from '../../../redux/slices/allUserSlice'
import { selectUser } from '../../../redux/slices/userSlice'

export default function PendingReq() {
    const user = useSelector(selectUser)
    const allUser = useSelector(selectAllUser)
    console.log(allUser)
    if (user.pendingReq.length == 0) {
        return (
            <View>
                <Text>
                    No Pending Req Yet
                </Text>
            </View>
        )
    }
    return (
        <View>
            {user.pendingReq.map((item) => {
                console.log(item)
                return (
                    <Item uid={item} key={item} name={allUser[item].name} />
                )
            })}
        </View>
    )
}

function Item({ uid, name }) {
    const navigation = useNavigation()

    const rejectPress = () => {
        unsendFollowReq(uid)
    }
    const navigateProfile = () => {
        navigation.navigate('Profile', { uid: uid, screen: 'Activity' })
    }
    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity style={styles.userbox} onPress={navigateProfile}>
                <Text style={styles.name}>USER: {name}</Text>
                <Text style={styles.uid}>uid: {uid}</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.no} onPress={rejectPress}>
                    <Text>Remove Req</Text>
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
        flexDirection: 'row',
        alignItems: 'stretch'
    },
    no: {
        flex: 1,
        padding: 5,
        backgroundColor: 'red',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    }
})