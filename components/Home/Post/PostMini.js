import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Dimensions, Platform, TouchableOpacity, Image } from 'react-native'
import { useSelector } from 'react-redux';
import { setPostData } from '../../../firebase/functions'
import { selectAllPosts } from '../../../redux/slices/allPostsSlice';
import Loading from '../../Helper/Loading';


const window = Dimensions.get("window");
const divideBig = 5;
const divideSmall = 3;
const initialWidth = Platform.OS === 'web' ? window.width / divideBig : window.width / divideSmall;
const SPACE = Platform.OS === 'web' ? 5 : 0;


export default function PostMini({ pid, style, navigateTo }) {
    const navigation = useNavigation();
    const [width, setWidth] = useState(initialWidth);

    const allPosts = useSelector(selectAllPosts);

    const [currentPost, setCurrentPost] = useState(null);

    useEffect(() => {
        if (allPosts && allPosts[pid]) {
            setPostData(allPosts[pid].uid, pid, setCurrentPost)
        }
    }, [allPosts])

    useEffect(() => {
        Dimensions.addEventListener("change", onChange);
        return () => {
            Dimensions.removeEventListener("change", onChange);
        };
    });

    const onChange = ({ window }) => {
        if (Platform.OS == 'web')
            setWidth(window.width / divideBig);
        else
            setWidth(window.width / divideSmall);
    };


    const openRelatedPosts = () => {
        const data = createSimilarPostList(pid, currentPost.uid, allPosts);
        navigation.navigate(navigateTo || "Explore", { pid: pid, uid: currentPost.uid, screen: 'PostMini', data: data })
    }

    if (!currentPost || !currentPost.uid) {
        return (
            <Loading />
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