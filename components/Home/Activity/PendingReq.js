import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { unsendFollowReq } from '../../../firebase/functions'
import { selectAllUser } from '../../../redux/slices/allUserSlice'
import { selectUser } from '../../../redux/slices/userSlice'
import { theme } from '../../Style/Constants'

export default function PendingReq() {
    const user = useSelector(selectUser)
    const allUser = useSelector(selectAllUser)
    console.log(allUser)
    if (user.pendingReq.length == 0) {
        return (
            <View style={styles.caughtUp}>
                <Avatar.Image source={require("../../../assets/caughtUp.png")} size={46}/>
                <View style={{ flexDirection: 'column', margin: 10}}>
                    <Text>You are all caught up!</Text>
                    <Text style={{ fontSize: 12 }}>No pending Requests</Text>
                </View>
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
                <Avatar.Image source={require("../../../assets/dummy.jpeg")} size={46}/>
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.smallText}>@username</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.no} onPress={rejectPress}>
                    <Text style={styles.text}>Remove</Text>
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
        textAlign: 'left'
    },
    smalltext: {
        fontSize: 8,
        color: 'red'
    },
    buttonContainer: {
        padding: 8,
        flexDirection: 'row',
    },
    no:{
        borderWidth: 0.5,
        borderRadius: 8,
        width: 75,
        height: 35,
        margin: 5,
        borderColor: theme.lightGrayBorder,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    text: { 
        color : theme.darkfont,
        fontWeight: "700",
    },
    // no: {
    //     flex: 1,
    //     padding: 5,
    //     backgroundColor: 'red',
    //     color: 'white',
    //     alignItems: 'center',
    //     justifyContent: 'center'
    // }
})