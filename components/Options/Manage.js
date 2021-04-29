import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, Platform } from 'react-native'
import { useSelector } from 'react-redux'
import { deletePost, editPost, updateCachedPosts } from '../../firebase/functions';
import { selectAllPosts } from '../../redux/slices/allPostsSlice';
import { selectCachedPosts } from '../../redux/slices/cachedPosts';
import { selectUser } from '../../redux/slices/userSlice'
import { BlurView } from 'expo-blur'

function extractUserPosts(allPosts, uid) {
    let list = []
    for (const key in allPosts) {
        if (allPosts[key].uid == uid) {
            list.push({ pid: key, ...allPosts[key] })
        }
    }
    list = list.sort((a, b) => a.time < b.time)
    return list;
}

export default function Manage() {
    const user = useSelector(selectUser);
    const allPosts = useSelector(selectAllPosts);
    const [currentList, setCurrentList] = useState([]);
    useEffect(() => {
        const list = extractUserPosts(allPosts, user.uid)
        setCurrentList(list);
    }, [user, allPosts])
    return (
        <View style={styles.listContainer}>
            <ScrollView contentContainerStyle={styles.scroll}>
                {currentList.map((item) => {
                    return (
                        <Item post={item} key={item.pid} />
                    )
                })}
            </ScrollView>
        </View>
    )
}

function Item({ post }) {
    const cachedPosts = useSelector(selectCachedPosts);
    const [currentPost, setCurrentPost] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        updateCachedPosts(post.pid)
        console.log(Date.now() + "updated cache post here")
    }, [post])

    useEffect(() => {
        setCurrentPost({ pid: post.pid, ...cachedPosts[post.pid] });
        setModalVisible(false)
    }, [cachedPosts[post.pid]])

    if (currentPost === null || !currentPost.uid) {
        return (
            <View>
                <Text>
                    Loading...
                </Text>
            </View>
        )
    }

    const handleDelete = () => {
        deletePost(currentPost.pid);
    }

    return (
        <View style={styles.item}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: currentPost.url }} style={{ resizeMode: 'cover', height: '100%' }} />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text>EDIT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleDelete}>
                    <Text>DELETE</Text>
                </TouchableOpacity>
            </View>
            <EditModal item={currentPost} visible={modalVisible} setVisible={setModalVisible} />
        </View>
    )
}

function EditModal({ item, visible, setVisible }) {
    const [caption, setCaption] = useState(item.caption);
    if (!visible) {
        return null;
    }

    const updatePost = () => {
        console.log("updated")
        editPost(item.pid, { caption: caption })
    }

    return (
        <BlurView intensity={130} tint="dark" style={[StyleSheet.absoluteFill, styles.modal]}>
            <View style={styles.scrollContainer}>
                <ScrollView contentContainerStyle={styles.modalScroll}>

                    <Text style={{ color: 'white' }}>PID: {item.pid}</Text>
                    <Text style={{ color: 'white' }}>ORIGINAL CAPTION: {item.caption}</Text>
                    <Text style={{ color: 'white' }}>Caption: </Text>
                    <TextInput placeholder="Caption"
                        value={caption}
                        onChangeText={(capt) => setCaption(capt)}
                        style={styles.inputModal}
                    />
                    <TouchableOpacity style={styles.modalButton} onPress={updatePost}>
                        <Text style={{ color: 'white' }}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => setVisible(false)}>
                        <Text style={{ color: 'white' }}>Close</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </BlurView>
    )
}

const styles = StyleSheet.create({
    listContainer: {
        flexDirection: 'column',
        flex: 1
    },
    scroll: {
        flexDirection: 'row',
        alignItems: 'stretch',
        flexWrap: 'wrap'
    },
    item: {
        flexDirection: 'column',
        alignItems: 'stretch',
        margin: Platform.OS == 'web' ? 15 : 0,
        marginBottom: 15
    },
    imageContainer: {
        height: Platform.OS == 'web' ? Dimensions.get('window').width / 3 : Dimensions.get('window').width,
        width: Platform.OS == 'web' ? Dimensions.get('window').width / 3 : Dimensions.get('window').width
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        padding: 5,
        margin: 5,
    },
    input: {
        backgroundColor: 'green',
        padding: 5
    },
    modal: {
        flexDirection: 'column',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: 10
    },
    modalScroll: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    scrollContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    inputModal: {
        padding: 5,
        borderWidth: 1,
        borderColor: 'white',
        color: 'white',
        margin: 5
    },
    modalButton: {
        borderColor: 'blue',
        borderWidth: 1,
        padding: 5,
        margin: 5
    }
})