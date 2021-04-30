import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux';
import { selectAllUser } from '../../../redux/slices/allUserSlice';
import { selectCachedPosts } from '../../../redux/slices/cachedPosts';
import { likePost, unlikePost, updateCachedPosts } from '../../../firebase/functions'
import { selectAllPosts } from '../../../redux/slices/allPostsSlice';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons'
import { Avatar } from 'react-native-paper';
import { selectUser } from '../../../redux/slices/userSlice';

const window = Dimensions.get("window");
const divide = 2.5;
const initialWidth = Platform.OS === 'web' ? window.width / divide : window.width;

export default function Post({ pid }) {

    const allPosts = useSelector(selectAllPosts);
    const allUsers = useSelector(selectAllUser);
    const cachedPosts = useSelector(selectCachedPosts);
    const user = useSelector(selectUser);

    const navigation = useNavigation();

    const [dimensions, setDimensions] = useState(initialWidth);
    const [currentPost, setCurrentPost] = useState(null);
    const [liked, setliked] = useState(false);
    const [likeClicked, setLikeClicked] = useState(false)

    useEffect(() => {
        updateCachedPosts(pid);
    }, [])

    useEffect(() => {
        if (cachedPosts && cachedPosts[pid] && cachedPosts[pid].likes) {
            setCurrentPost(cachedPosts[pid]);
            setliked(cachedPosts[pid].likes.includes(user.uid))
        }
    }, [cachedPosts])

    const onChange = ({ window }) => {
        if (Platform.OS == 'web')
            setDimensions(window.width / divide);
        else
            setDimensions(window.width);
    };

    useEffect(() => {
        Dimensions.addEventListener("change", onChange);
        return () => {
            Dimensions.removeEventListener("change", onChange);
        };
    }, []);

    const openProfile = () => {
        navigation.navigate("Profile", { pid: pid, uid: currentPost.uid, screen: 'Post', name: allUsers[currentPost.uid].name })
    }

    const likeToggle = async () => {
        if (!likeClicked) {
            setLikeClicked(true)
            liked ? await unlikePost(currentPost.uid, pid, user.uid, setLikeClicked) : await likePost(currentPost.uid, pid, user.uid, setLikeClicked)
        }
    }

    if (loadingDependency(allPosts, allUsers, cachedPosts, user, pid) || !currentPost || !currentPost.loaded) {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', height: dimensions, width: dimensions }}>
                <ActivityIndicator size="large" color="green" />
            </View>
        )
    }

    const gotoComments = () => {
        navigation.navigate('Comments', { uid: currentPost.uid, screen: 'Post', pid: pid })
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity
                    onPress={openProfile}
                    style={styles.flexRow}>
                    <Avatar.Image
                        source={{ uri: currentPost.url }}
                        size={32}
                    />
                    <Text style={[styles.bold, { padding: 4 }]} > {allUsers[currentPost.uid].name}</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.image, { height: dimensions, width: dimensions }]}>
                <Image source={{ uri: currentPost.url }} style={{ height: '100%', resizeMode: 'cover' }} />
            </View>

            <View style={styles.flexRow}>
                <TouchableOpacity
                    title="like"
                    onPress={() => likeToggle()}>
                    <IonIcons
                        name={liked ? "heart" : "heart-outline"}
                        style={[styles.icon, { fontSize: 28 }, { color: liked ? 'crimson' : 'black' }]}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    title="comment">
                    <IonIcons
                        name="chatbubble-outline"
                        style={styles.icon}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    title="send">
                    <Icon
                        name="send-o"
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.bold}>{allPosts[pid].numLike} likes</Text>

                <View style={styles.flexRow}>
                    <Text style={styles.bold}>{allUsers[currentPost.uid].name} </Text>
                    <Text>{currentPost.caption}</Text>
                </View>

                <TouchableOpacity
                    onPress={gotoComments}
                >
                    <Text style={styles.lightgrey}>View all comments</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


function loadingDependency(allPosts, allUsers, cachedPosts, user, pid) {
    if (!allPosts || !allPosts.loaded) {
        return true
    }
    if (!cachedPosts || !cachedPosts[pid] || !cachedPosts[pid].loaded) {
        return true;
    }
    if (!allUsers || !allUsers.loaded) {
        return true;
    }
    if (!user || !user.loaded) {
        return true
    }
    return false
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        paddingTop: 5,
        paddingBottom: 8
    },
    header: {
        flexDirection: 'row',
        padding: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
    image: {
        flexDirection: 'column',
    },
    flexRow: {
        flexDirection: 'row',
    },
    icon: {
        fontSize: 24,
        margin: 6,
    },
    footer: {
        flexDirection: 'column',
        padding: 5,
        paddingTop: 0,
    },
    lightgrey: {
        color: 'darkgrey',
    }
})