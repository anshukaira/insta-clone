import React, { useEffect, useState } from 'react'
import { View, StyleSheet, StatusBar, ActivityIndicator, Text, Dimensions } from 'react-native'
import Posts from '../Post/Posts'
import Header from './Header'
import { theme } from '../../Style/Constants'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/slices/userSlice'
import { selectAllPosts } from '../../../redux/slices/allPostsSlice'
import Icon from 'react-native-vector-icons/Ionicons'
import { POST_VISIBILITY } from '../../CONSTANTS'
import { descriptiveText } from '../../Style/Common'


export default function Feed() {

    const user = useSelector(selectUser);
    const allPosts = useSelector(selectAllPosts);

    const [update, setUpdate] = useState(false)
    const [currentPostList, setCurrentPostList] = useState([]);

    useEffect(() => {
        if (loadingDependency(user, allPosts)) {
            return
        }
        let data = extractPostsList(allPosts, user);
        let toBeUpdated = false;
        if (currentPostList.length == 0) {
            setCurrentPostList(data)
        } else {
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

    if (loadingDependency(user, allPosts)) {
        return (
            <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        )
    }

    const updateData = () => {
        let data = extractPostsList(allPosts, user);
        setCurrentPostList(data);
        setUpdate(false);
    }


    if (currentPostList.length == 0) {
        return (descriptiveText('Opps! No Post Yet.'))
    }
    return (
        <View style={styles.container}>
            <Header />
            <Posts showStory={false} margin={50} data={currentPostList} />
            {update ? <Icon name="md-add-circle-outline" onPress={updateData} style={styles.icon} /> : null}
        </View>
    )
}


function extractPostsList(allPosts, user) {
    let list = [];
    let avgLikes = 0;
    const following = user.following;

    for (const key in allPosts) {
        if (following.includes(allPosts[key].uid) || allPosts[key].uid == user.uid || (allPosts[key].visibility == POST_VISIBILITY.PUBLIC && allPosts[key].numLikes >= avgLikes)) {
            avgLikes = (avgLikes * list.length + allPosts[key].numLikes) / (list.length + 1)
            list.push({ pid: key, ...allPosts[key] })
        }
    }

    list.sort((a, b) => a.time < b.time)
    return list;
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.lightbg,
        color: theme.lightfont,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingTop: StatusBar.currentHeight,
    },
    icon: {
        fontSize: 32,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignContent: 'center',
        position: 'absolute',
        top: StatusBar.currentHeight + 30,
        left: Dimensions.get('window').width / 2
    }
})
