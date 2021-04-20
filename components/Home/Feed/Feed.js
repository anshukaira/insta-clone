import React, { useEffect, useState } from 'react'
import { View, StyleSheet, StatusBar, Button, Text } from 'react-native'
import Posts from '../Post/Posts'
import Header from './Header'
import { theme } from '../../Style/Constants'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/slices/userSlice'
import { selectAllPosts } from '../../../redux/slices/allPostsSlice'
import { set } from '../../../redux/slices/allUserSlice'


function extractPostsList(allPost, user) {
    const following = user.following;
    let combine = [];
    for (const key in allPost) {
        if (following.includes(allPost[key].uid)) {
            combine.push(allPosts[key])
        }
    }
    combine.sort((a, b) => a.time < b.time)
    return combine;
}



export default function Feed() {
    const [currentPostList, setCurrentPostList] = useState([]);
    const allPosts = useSelector(selectAllPosts);
    const user = useSelector(selectUser);
    const [update, setUpdate] = useState(false)
    useEffect(() => {
        let data = extractPostsList(allPosts, user);
        if (currentPostList.length == 0) {
            setCurrentPostList(data)
        } else {
            for (item in data) {
                if (!currentPostList.includes(item)) {
                    setUpdate(true);
                    break;
                }
            }
        }
    }, [allPosts, user])

    const updateData = () => {
        let data = extractPostsList(allPosts, user);
        setCurrentPostList(data);
        setUpdate(false);
    }


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
    return (
        <View style={styles.container}>
            <Header />
            <Posts showStory={false} margin={50} data={currentPostList} />
            {update ? <Button title="uppdate" onPress={updateData} /> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.lightbg,
        color: theme.lightfont,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingTop: StatusBar.currentHeight,
    }
})
