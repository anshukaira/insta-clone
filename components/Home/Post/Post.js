import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, Image } from 'react-native'
import { useSelector } from 'react-redux';
import { selectAllUser } from '../../../redux/slices/allUserSlice';
import { selectCachedPosts } from '../../../redux/slices/cachedPosts';
import { updateCachedPosts } from '../../../firebase/functions'
import { selectAllPosts } from '../../../redux/slices/allPostsSlice';

const window = Dimensions.get("window");
const divide = 2.5;
const initialWidth = Platform.OS === 'web' ? window.width / divide : window.width;

export default function Post({ pid }) {
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
        console.log("cached post update")
    }, [cachedPosts])
    console.log("Current Post", currentPost)
    const onChange = ({ window }) => {
        if (Platform.OS == 'web')
            setDimensions(window.width / divide);
        else
            setDimensions(window.width);
    };

    useEffect(() => {
        Dimensions.addEventListener("change", onChange);
        // console.log("Post mounted: " + pid)
        return () => {
            // console.log("Post unmounted: " + pid)
            Dimensions.removeEventListener("change", onChange);
        };
    }, []);

    const openProfile = () => {
        navigation.navigate("Profile", { pid: pid, uid: currentPost.uid, screen: 'Post' })
    }

    if (!currentPost || !currentPost.uid) {
        return (
            <View>
                <Text>Loading Post</Text>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text onPress={openProfile} >{allUsers[currentPost.uid].name}</Text>
            </View>
            <View style={[styles.image, { height: dimensions, width: dimensions }]}>
                <Image source={{ uri: currentPost.url }} style={{ height: '100%', resizeMode: 'cover' }} />
            </View>
            <View style={styles.footer}>
                <Text>{pid}</Text>
                <Text>{currentPost.caption}</Text>
                <Text>Likes: {allPosts[pid].numLike}</Text>
                <Text>Comments: {allPosts[pid].numComments}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        paddingTop: 10,
        paddingBottom: 10
    },
    header: {
        flexDirection: 'row',
        padding: 5,
    },
    image: {
        flexDirection: 'column',
    },
    footer: {
        flexDirection: 'column',
        padding: 5,
    }
})