import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useSelector } from 'react-redux'
import { selectAllPosts } from '../../../redux/slices/allPostsSlice'
import { selectUser } from '../../../redux/slices/userSlice';

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
        if (user.following.includes(me.uid)) {
            const data = createSimilarPostList(user.uid, allPosts);
            navigation.navigate("Posts", { uid: user.uid, data: data });
        }
    }
    const followingPress = () => {
        if (user.following.includes(me.uid)) {

        }
    }
    const followersPress = () => {
        if (user.following.includes(me.uid)) {

        }
    }

    return (
        <View style={[styles.container, style]}>
            <View style={styles.details}>
                <DPContainer uri={user.dp} />
                <CountBox count={numPosts} text="Posts" onPress={postPress} />
                <CountBox count={user.followers.length} text="Followers" onPress={followersPress} />
                <CountBox count={user.following.length} text="Following" onPress={followingPress} />
            </View>
            <View style={styles.content}>
                <Text style={{ fontSize: 24 }}>Its Me {user.about}</Text>
                <Text style={{ fontSize: 20 }}>About me</Text>
            </View>
        </View>
    )
}

function DPContainer({ url }) {
    return (
        <View style={styles.dpshape}>
            <Image source={{ uri: url }} style={{ resizeMode: 'cover', height: '100%' }} />
        </View>
    )
}

function CountBox({ count, text }) {
    return (
        <TouchableOpacity style={styles.countbox}>
            <Text style={{ fontSize: 24 }}>{count}</Text>
            <Text style={{ fontSize: 14 }}>{text}</Text>
        </TouchableOpacity>
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