import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Platform, FlatList, StatusBar, Dimensions } from 'react-native'
import { Searchbar } from 'react-native-paper'
import Post from '../Post/PostMini'
import { useSelector } from 'react-redux'
import { selectPubPosts } from '../../../redux/slices/pubPostsSlice'
import { selectProtPosts } from '../../../redux/slices/protPostsSlice'
import { selectUser } from '../../../redux/slices/userSlice'
import { theme } from '../../Style/Constants'

const { width: WIDTH } = Dimensions.get('window');

function extractPostsList(pubPost, protPost, mydata) {
    const following = mydata.following;
    let combine = [];
    for (const post in pubPost) {
        if (pubPost[post].uid != mydata.uid) {
            combine.push({ pid: post, time: pubPost[post].time })
        }
    }
    for (const post in protPost) {
        if (protPost[post].uid != mydata.uid && following.includes(protPost[post])) {
            combine.push({ pid: post, time: pubPost[post].time })
        }
    }
    combine.sort((a, b) => a.time > b.time)
    return combine;
}

export default function Discover() {
    const [currentPostList, setCurrentPostList] = useState(null);
    const pubPosts = useSelector(selectPubPosts);
    const protPosts = useSelector(selectProtPosts);
    const myData = useSelector(selectUser);

    useEffect(() => {
        let data = extractPostsList(pubPosts, protPosts, myData);
        setCurrentPostList(data);
    }, [pubPosts, protPosts, myData])


    if (currentPostList === null) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>)
    }

    if (currentPostList.length == 0) {
        return (
            <View>
                <Text>
                    Opps! No Post Yet.
                </Text>
            </View>
        )
    }


    if (Platform.OS === 'web') {
        return (
            <FlatList
                data={currentPostList}
                renderItem={({ item }) => {
                    return <Post style={styles.listItem} pid={item.pid} />
                }}
                keyExtractor={item => item.pid}
                initialNumToRender={10}
                refreshing={true}
                style={styles.list}
                ListHeaderComponent={Searchbar}
                numColumns={5}
                columnWrapperStyle={styles.col}
            />
        )
    }
    return (
        <FlatList
            data={currentPostList}
            renderItem={({ item }) => {
                return <Post style={styles.listItem} pid={item.pid} />
            }}
            keyExtractor={item => item.pid}
            initialNumToRender={10}
            refreshing={true}
            style={styles.list}
            ListHeaderComponent={Searchbar}
            numColumns={3}
            columnWrapperStyle={styles.col}
        />
    )
}

const styles = StyleSheet.create({
    list: {
        marginTop: StatusBar.currentHeight,
        backgroundColor: theme.lightbg,
    },
    col: {
        justifyContent: 'flex-start',
    },
    listItem: {
        margin: 2,
        width: WIDTH/3,
    }
})