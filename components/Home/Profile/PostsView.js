import React, { useEffect, useState } from 'react'
import { View, Platform, FlatList, StyleSheet, StatusBar, Dimensions, Text } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Post from '../Post/PostMini'
import { useRoute } from '@react-navigation/core'
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import { selectAllPosts } from '../../../redux/slices/allPostsSlice'
import { selectUser } from '../../../redux/slices/userSlice'

function extractPostsList(allPosts, uid) {
    let userPosts = [];
    for (const key in allPosts) {
        if (allPosts[key].uid == uid) {
            userPosts.push({ pid: key, ...allPosts[key] })
        }
    }
    return userPosts;
}

const Tab = createMaterialTopTabNavigator();

export default function PostsView({ user }) {
    const me = useSelector(selectUser);
    if (me.uid !== user.uid && (user.vis == 'PROTECTED' || user.vis == 'PRIVATE') && !user.followers.includes(me.uid)) {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>
                    This Account is Private. Send Follow req to View Posts
                </Text>
            </View>
        )
    }
    return (
        <View>
            <Tab.Navigator initialLayout={{ width: Dimensions.get('window').width }} style={{ flex: 1 }}>
                <Tab.Screen name="Normal" component={Normal} initialParams={{ uid: user.uid }} />
            </Tab.Navigator>
        </View>
    )
}

function Normal() {
    const allPosts = useSelector(selectAllPosts);
    const [currentPostList, setCurrentPostList] = useState([]);
    const route = useRoute();
    useEffect(() => {
        const data = extractPostsList(allPosts, route.params.uid)
        setCurrentPostList(data)
    }, [allPosts])

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                {currentPostList.map((item) => {
                    return (
                        <Post key={item.pid} pid={item.pid} navigateTo="Posts" style={styles.item} />
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scroll: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    item: {
        margin: 5
    }
})