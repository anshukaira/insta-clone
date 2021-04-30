import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Dimensions, Platform, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux';
import { selectAllUser } from '../../../redux/slices/allUserSlice';
import { selectCachedPosts } from '../../../redux/slices/cachedPosts';
import { updateCachedPosts } from '../../../firebase/functions'
import { selectAllPosts } from '../../../redux/slices/allPostsSlice';


const window = Dimensions.get("window");
const divideBig = 5;
const divideSmall = 3;
const initialWidth = Platform.OS === 'web' ? window.width / divideBig : window.width / divideSmall;
const SPACE = Platform.OS === 'web' ? 5 : 0;


export default function PostMini({ pid, style, navigateTo }) {
    const navigation = useNavigation();
    const [width, setWidth] = useState(initialWidth);

    const allPosts = useSelector(selectAllPosts);
    const cachedPosts = useSelector(selectCachedPosts);

    const [currentPost, setCurrentPost] = useState(null);

    useEffect(() => {
        updateCachedPosts(pid);
    }, [])

    useEffect(() => {
        setCurrentPost(cachedPosts[pid]);
    }, [cachedPosts[pid]])

    const onChange = ({ window }) => {
        if (Platform.OS == 'web')
            setWidth(window.width / divideBig);
        else
            setWidth(window.width / divideSmall);
    };

    useEffect(() => {
        Dimensions.addEventListener("change", onChange);
        return () => {
            Dimensions.removeEventListener("change", onChange);
        };
    });

    const openRelatedPosts = () => {
        const data = createSimilarPostList(pid, currentPost.uid, allPosts);
        navigation.navigate(navigateTo || "Explore", { pid: pid, uid: currentPost.uid, screen: 'PostMini', data: data })
    }

    if (!currentPost || !currentPost.loaded) {
        return (
            <View style={[{ justifyContent: 'center', alignItems: 'center' }, { height: width - SPACE, width: width - SPACE }]}>
                <ActivityIndicator size="large" color="green" />
            </View>
        )
    }
    return (
        <TouchableOpacity onPress={openRelatedPosts} style={[styles.image, { height: width - SPACE, width: width - SPACE }, style]}>
            <Image source={{ uri: currentPost.url }} style={{ height: '100%', resizeMode: 'cover', backgroundColor: 'lightgray' }} />
        </TouchableOpacity>
    )
}

const createSimilarPostList = (pid, uid, allPosts) => {
    let list = [];
    for (const key in allPosts) {
        if (allPosts[key].uid == uid) {
            list.push({ pid: key, ...allPosts[key] })
        }
    }
    return list
}

const styles = StyleSheet.create({
    image: {
        flexDirection: 'column',
        backgroundColor: 'green'
    },
    loading: {
        backgroundColor: 'gray',
    }
})