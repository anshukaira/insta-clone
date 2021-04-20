import React, { useEffect, useState } from 'react'
import { View, StyleSheet, StatusBar, Button, Text } from 'react-native'
import Posts from '../Post/Posts'
import Header from './Header'
import { theme } from '../../Style/Constants'
import { useSelector } from 'react-redux'
import { selectPubPosts } from '../../../redux/slices/pubPostsSlice'
import { selectProtPosts } from '../../../redux/slices/protPostsSlice'
import { selectUser } from '../../../redux/slices/userSlice'


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
    // protPost.forEach((key, value) => {
    //     if (following.includes(value.uid) && value.uid != mydata.uid) {
    //         combine.push({ pid: key, time: value.time })
    //     }
    // })

    combine.sort((a, b) => a.time > b.time)
    return combine;
}



export default function Feed() {
    const [currentPostList, setCurrentPostList] = useState(null);
    // const [updatedPostList, setUpdatedPostList] = useState(null);
    const pubPosts = useSelector(selectPubPosts);
    const protPosts = useSelector(selectProtPosts);
    const myData = useSelector(selectUser);
    // const [update, setUpdate] = useState(false)
    // console.log(pubPosts)
    useEffect(() => {
        let data = extractPostsList(pubPosts, protPosts, myData);
        // if (currentPostList === null || currentPostList.length === 0) {
        setCurrentPostList(data);
        // } else {
        //     let difference = data.filter(x => !currentPostList.includes(x));
        //     difference = difference.sort((a, b) => a.time > b.time)
        //     setUpdate(difference.length);
        //     setUpdatedPostList(data);
        // }
    }, [pubPosts, protPosts, myData])

    // const updateData = () => {
    //     setCurrentPostList(updatedPostList);
    //     setUpdate(false);
    // }

    // console.log(currentPostList);
    // console.log(updatedPostList);

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
            {/* {update ? <Button title="uppdate" onPress={updateData} /> : null} */}
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
