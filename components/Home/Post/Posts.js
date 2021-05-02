import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, StyleSheet, Button, Text } from 'react-native'
import Post from './Post'
import Story from '../Feed/Story'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation, useRoute } from '@react-navigation/core'
import Icon from 'react-native-vector-icons/Ionicons'
import { theme } from '../../Style/Constants'

const LIMIT = 2;


export default function Posts({ showStory, margin, data }) {

    const [visible, setVisible] = useState([]);

    const route = useRoute();

    const postList = data || route.params.data || []
    const showLoad = visible.length < postList.length

    useEffect(() => {
        let newVisible = []
        newVisible = updateNextVisible(visible, postList, LIMIT)
        setVisible(newVisible);
    }, [data, route.params])

    const loadMore = () => {
        let newVisible = []
        newVisible = updateNextVisible(visible, postList, LIMIT);
        setVisible(newVisible);
    }
    if (visible.length == 0) {
        return (
            <View>
                <Text>No Post</Text>
            </View>
        )
    }

    return (
        <View style={[styles.container, { marginTop: margin }]}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={{ alignItems: 'center' }}>
                    {showStory ? <Story /> : null}
                    {visible.map((item) => {
                        return (
                            <Post pid={item.pid} key={item.pid} />
                        )
                    })}
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {showLoad ? <Icon name="md-add-circle-outline" onPress={loadMore} style={styles.icon} /> : null}
                </View>
            </ScrollView>
        </View>
    )
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

const styles = StyleSheet.create({
    list: {
        // marginTop: 50,
    },
    col: {
        justifyContent: 'space-around',
    },
    header: {
        // marginTop: 50
    },
    container: {
        // marginTop: 50,
        flex: 1,
        backgroundColor: theme.lightbg,
    },
    scroll: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
    },
    icon: {
        fontSize: 32,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignContent: 'center'
    }
})
