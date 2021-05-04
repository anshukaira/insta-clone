import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { acceptFollowReq, rejectFollowReq } from '../../../firebase/functions'
import { selectAllUser } from '../../../redux/slices/allUserSlice'
import { selectUser } from '../../../redux/slices/userSlice'
import { DUMMY_DATA } from '../../CONSTANTS'
import { theme } from '../../Style/Constants'

export default function FollowReq() {
    const user = useSelector(selectUser)
    const allUser = useSelector(selectAllUser)
    if (user.followReq.length == 0) {
        return (
            <View style={styles.caughtUp}>
                <Avatar.Image source={require("../../../assets/caughtUp.png")} size={46} />
                <Text style={{ margin: 10 }}>You are all caught up!</Text>
            </View>
        )
    }
    return (
        <View>
            {user.followReq.map((item) => {
                return (
                    <Item uid={item} key={item} name={allUser[item].name}
                    //url={allUser[item].dp}
                    />
                )
            })}
        </View>
    )
}

function Item({ uid, name }) {
    const navigation = useNavigation();
    const allUsers = useSelector(selectAllUser)
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
                <Avatar.Image source={{ uri: allUsers[uid].dp ? allUsers[uid].dp : DUMMY_DATA.dp }} size={46} />
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.smallText}>@{allUsers[uid].username}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.yes]} onPress={acceptPress}>
                    <Text style={styles.text}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.no]} onPress={rejectPress}>
                    <Text style={[styles.text, { color: theme.lightfont }]}>Delete</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    caughtUp: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme.lightbg,
        padding: 12,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.lightbg,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.lightGrayBorder,
    },
    userbox: {
        flexDirection: 'row',
        padding: 10,
    },
    textContainer: {
        marginLeft: 8,
    },
    name: {
        fontSize: 18,
        textAlign: 'left',
    },
    smalltext: {
        fontSize: 8,
        color: 'red'
    },
    buttonContainer: {
        padding: 8,
        flexDirection: 'row',
    },
    button: {
        borderWidth: 0.5,
        borderRadius: 8,
        width: 75,
        height: 35,
        margin: 5,
        borderColor: theme.lightGrayBorder,
        justifyContent: 'center',
        alignItems: 'center'
    },
    yes: {
        backgroundColor: theme.lightButton,
    },
    no: {
        backgroundColor: 'white',
    },
    text: {
        color: theme.darkfont,
        fontWeight: "700",
    },
})