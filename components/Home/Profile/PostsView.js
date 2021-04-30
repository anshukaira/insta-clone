import React, { useEffect, useState } from 'react'
import { View, Platform, FlatList, StyleSheet, StatusBar, Dimensions, Text } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Post from '../Post/PostMini'
import { useRoute } from '@react-navigation/core'
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import { selectAllPosts } from '../../../redux/slices/allPostsSlice'
import { selectUser } from '../../../redux/slices/userSlice'
import { theme } from '../../Style/Constants'
import Icon from 'react-native-vector-icons/Ionicons'
import { PROFIILE_VISIBILITY } from '../../CONSTANTS'


const Tab = createMaterialTopTabNavigator();


export default function PostsView({ user }) {

    const me = useSelector(selectUser);

    if (me.uid !== user.uid && (user.vis == PROFIILE_VISIBILITY.PROTECTED || user.vis == PROFIILE_VISIBILITY.PRIVATE) && !user.followers.includes(me.uid)) {
        return (
            <View style={styles.privateAccContainer}>
                <Icon name='lock-closed-outline' style={{ fontSize: 96, marginTop: 80 }} />
                <Text style={{ fontSize: 26 }}>
                    This Account is Private.
                </Text>
                <Text>
                    Follow the account to see their photos and videos.
                </Text>
            </View>
        )
    }
    return (
        <View>
            <Tab.Navigator
                initialLayout={{ width: Dimensions.get('window').width }}
                style={{ flex: 1 }}
                tabBarOptions={{ showLabel: false, showIcon: true }}
            >
                <Tab.Screen
                    name="User | Posts"
                    component={Normal}
                    options={{
                        tabBarIcon: () => (
                            <Icon name="grid-outline" size={26} />)
                    }}
                    initialParams={{ uid: user.uid }} />
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
            {currentPostList.map((item) => {
                return (
                    <Post key={item.pid} pid={item.pid} navigateTo="Posts" style={styles.item} />
                )
            })}
        </View>
    )
}

function extractPostsList(allPosts, uid) {
    let userPosts = [];
    for (const key in allPosts) {
        if (allPosts[key].uid == uid) {
            userPosts.push({ pid: key, ...allPosts[key] })
        }
    }
    return userPosts;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: theme.lightbg,
    },
    scroll: {
        // flexDirection: 'row',
        // flexWrap: 'wrap'
    },
    item: {
        backgroundColor: theme.lightbg,
        padding: 2,
    },
    privateAccContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.lightGrayBorder,
        marginTop: 10
    }
})