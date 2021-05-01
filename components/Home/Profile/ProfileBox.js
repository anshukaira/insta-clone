import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Avatar } from 'react-native-paper';
import { useSelector } from 'react-redux'
import { selectAllPosts } from '../../../redux/slices/allPostsSlice'
import { selectUser } from '../../../redux/slices/userSlice';
import { DUMMY_DATA } from '../../CONSTANTS';


export default function ProfileBox({ style, user }) {
    const allPosts = useSelector(selectAllPosts);
    const me = useSelector(selectUser);

    const [numPosts, setNumPosts] = useState(0);

    const navigation = useNavigation();

    useEffect(() => {
        let count = countPosts(user.uid, allPosts);
        setNumPosts(count);
    }, [allPosts])

    const postPress = () => {
        if (user.followers.includes(me.uid) || user.uid == me.uid) {
            const data = createSimilarPostList(user.uid, allPosts);
            navigation.navigate("Posts", { uid: user.uid, data: data, screen: 'Profile' });
        }
    }
    const followingPress = () => {
        if (user.following.includes(me.uid)) {

        }
        navigation.setOptions({ headerTitle: 'HELLO' })
        console.log(navigation.setOptions)
    }
    const followersPress = () => {
        if (user.following.includes(me.uid)) {

        }
    }

    return (
        <View style={[styles.container, style]}>
            <View style={styles.details}>
                <DPContainer url={user.dp ? user.dp : DUMMY_DATA.dp} />
                <CountBox count={numPosts} text="Posts" press={postPress} />
                <CountBox count={user.followers.length} text="Followers" press={followersPress} />
                <CountBox count={user.following.length} text="Following" press={followingPress} />
            </View>
            <View style={styles.content}>
                <Text style={{ fontSize: 16 }}>{user.name ? user.name : DUMMY_DATA.name}</Text>
                <Text style={{ fontSize: 16 }}>{user.about ? user.about : DUMMY_DATA.about}</Text>
            </View>
        </View>
    )
}

function DPContainer({ url }) {
    return (
        <View style={styles.dpshape}>
            <Avatar.Image source={{ uri: url }} size={82} />
        </View>
    )
}

function CountBox({ count, text, press }) {
    return (
        <TouchableOpacity style={styles.countbox} onPress={press}>
            <Text style={{ fontSize: 24 }}>{count}</Text>
            <Text style={{ fontSize: 14 }}>{text}</Text>
        </TouchableOpacity>
    )
}


function countPosts(uid, allPosts) {
    let count = 0;
    for (const key in allPosts) {
        if (allPosts[key].uid == uid) {
            count++;
        }
    }
    return count;
}

const createSimilarPostList = (uid, allPosts) => {
    let list = [];
    for (const key in allPosts) {
        if (allPosts[key].uid == uid) {
            list.push({ pid: key, ...allPosts[key] })
        }
    }
    return list
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    details: {
        paddingLeft: 20,
        paddingRight: 10,
        paddingTop: 10,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center'
    },
    dpshape: {
        marginRight: 30,
        marginBottom: 10,
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
        paddingTop: 2,
    }
})