import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Dimensions, Platform, TouchableOpacity, Image } from 'react-native'
import { useSelector } from 'react-redux';
import { selectAllUser } from '../../../redux/slices/allUserSlice';
import { selectCachedPosts } from '../../../redux/slices/cachedPosts';
import { updateCachedPosts } from '../../../firebase/functions'
import { selectAllPosts } from '../../../redux/slices/allPostsSlice';


const window = Dimensions.get("window");
const divideBig = 5.5;
const divideSmall = 3.5;
const initialWidth = Platform.OS === 'web' ? window.width / divideBig : window.width / divideSmall;


const createSimilarPostList = (pid, uid, allPosts) => {
    let list = [];
    for (const key in allPosts) {
        if (allPosts[key].uid == uid) {
            list.push({ pid: key, ...allPosts[key] })
        }
    }
    return list
}

export default function PostMini({ pid, style, navigateTo }) {
    const navigation = useNavigation();
    const [dimensions, setDimensions] = useState(initialWidth);

    const allPosts = useSelector(selectAllPosts);
    const allUsers = useSelector(selectAllUser);
    const cachedPosts = useSelector(selectCachedPosts);

    const [currentPost, setCurrentPost] = useState(null);

    useEffect(() => {
        updateCachedPosts(pid);
    }, [allPosts, allUsers])

    useEffect(() => {
        setCurrentPost(cachedPosts[pid]);
    }, [cachedPosts[pid]])

    const onChange = ({ window }) => {
        if (Platform.OS == 'web')
            setDimensions(window.width / divideBig);
        else
            setDimensions(window.width / divideSmall);
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

    if (!currentPost || !currentPost.uid) {
        return (
            <View>
                <Text>Loading Post</Text>
            </View>
        )
    }
    return (
        <TouchableOpacity onPress={openRelatedPosts} style={[styles.image, { height: dimensions, width: dimensions }, style]}>
            <Image source={{ uri: currentPost.url }} style={{ height: '100%', resizeMode: 'cover' }} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    image: {
        flexDirection: 'column',
        backgroundColor: 'green'
    },
})