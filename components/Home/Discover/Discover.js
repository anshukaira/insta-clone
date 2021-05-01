import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, StatusBar, Dimensions, Button } from 'react-native'
import { Searchbar } from 'react-native-paper'
import Post from '../Post/PostMini'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/slices/userSlice'
import { theme } from '../../Style/Constants'
import { descriptiveText } from '../../Style/Common'
import { selectAllPosts } from '../../../redux/slices/allPostsSlice'
import { ScrollView } from 'react-native-gesture-handler'
import { POST_VISIBILITY } from '../../CONSTANTS'

const { width: WIDTH } = Dimensions.get('window');

const LIMIT = 5;

export default function Discover() {
    const [currentPostList, setCurrentPostList] = useState([]);
    const [visible, setVisible] = useState([]);
    const [update, setUpdate] = useState(false)

    const allPosts = useSelector(selectAllPosts)
    const user = useSelector(selectUser);

    useEffect(() => {
        if (loadingDependency(user, allPosts)) {
            return
        }
        let data = extractPostsList(allPosts, user);
        if (currentPostList.length == 0) {
            setCurrentPostList(data);
        } else {
            let toBeUpdated = false;
            for (const item of data) {
                let diff = currentPostList.filter((val) => val.pid == item.pid)
                if (diff.length == 0) {
                    toBeUpdated = true;
                    break;
                }
            }
            setUpdate(toBeUpdated)
        }
    }, [allPosts, user])

    useEffect(() => {
        let newVisible = []
        newVisible = updateNextVisible(visible, currentPostList, LIMIT)
        setVisible(newVisible);
    }, [currentPostList])

    if (loadingDependency(user, allPosts)) {
        return (descriptiveText('Loading...'))
    }

    if (currentPostList.length == 0) {
        return (descriptiveText('Opps! No Post Yet.'))
    }

    const loadMore = () => {
        let newVisible = []
        newVisible = updateNextVisible(visible, currentPostList, LIMIT);
        setVisible(newVisible);
    }


    return (
        <View style={{ flex: 1 }}>
            <Searchbar />
            <ScrollView>
                {visible.map((item) => {
                    console.log(item)
                    return <Post pid={item.pid} key={item.pid} />
                })}
                <Button onPress={loadMore} title="Load More" />
            </ScrollView>
            {update ? <Button onPress={updateList} title="Update" /> : null}
        </View>
    )
}

function loadingDependency(user, allPosts) {
    if (!user || !user.loaded) {
        return true
    }
    if (!allPosts || !allPosts.loaded) {
        return true
    }
    return false
}

function updateNextVisible(visible, data, LIMIT) {
    let newVisible = [];
    let count = 0;
    console.log(data);
    for (const item of data) {
        let diff = visible.filter((it) => it.pid == item.pid)
        if (diff.length == 0) {
            count++;
        }
        else {
            console.log("exists")
        }
        newVisible.push(item);
        if (count > LIMIT) {
            break;
        }
    }
    return newVisible;
}

function extractPostsList(allPosts, user) {
    const following = user.following;
    let list = [];
    if (following === undefined) {
        return list;
    }
    for (const pid in allPosts) {
        if (pid == 'loaded') {
            continue
        }
        if (allPosts[pid].uid == user.uid) {
            continue;
        }
        if (allPosts[pid].visibility == POST_VISIBILITY.PROTECTED) {
            continue;
        }
        if (user.following.includes(allPosts[pid].uid)) {
            continue;
        }
        list.push({ pid: pid, time: allPosts[pid].time })
    }
    list.sort((a, b) => a.time < b.time ? 1 : -1)
    return list;
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
        width: WIDTH / 3,
    }
})