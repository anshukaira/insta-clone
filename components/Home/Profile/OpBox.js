import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux';
import { followUser, sendFollowReq, unfollowUser, unsendFollowReq } from '../../../firebase/functions';
import { selectUser } from '../../../redux/slices/userSlice';
import { theme } from '../../Style/Constants';

export function OwnBox({ user }) {
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

export function OtherBox({ user }) {
    const me = useSelector(selectUser);
    if (user.uid == me.uid) {
        return null
    }
    const [following, setFollowing] = useState({ type: 'NOT', text: 'Follow' });
    useEffect(() => {
        if (user.followers.includes(me.uid)) {
            setFollowing({ type: 'YES', text: 'Following' });
        } else if (user.followReq.includes(me.uid)) {
            setFollowing({ type: 'PENDING', text: 'Request Sent' });
        } else {
            setFollowing({ type: 'NOT', text: 'Follow' })
        }
    }, [user, me])

    const followPress = () => {
        if (following.type == 'NOT' && user.vis == 'PUBLIC') {
            followUser(user.uid);
            return;
        }
        if (following.type == 'NOT' && (user.vis == 'PROTECTED' || user.vis == 'PRIVATE')) {
            sendFollowReq(user.uid);
            return;
        }
        if (following.type == 'PENDING') {
            unsendFollowReq(user.uid)
            return;
        }
        if (following.type == 'YES') {
            unfollowUser(user.uid)
            return;
        }
    }

    const messagePress = () => {

    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.box, { flex: 6 }]} onPress={followPress}>
                <Text>{following.text}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.box, { flex: 6 }]} onPress={messagePress}>
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
        alignItems: 'center',
        paddingBottom: 2,
    },
    box: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#DCDCDC',
        marginLeft: 4,
        marginRight: 4,
        padding: 5,
        alignItems: 'center'
    }
})