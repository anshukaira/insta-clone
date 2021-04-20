import React, { useEffect } from 'react'
import { View, Platform, StyleSheet, FlatList, Button } from 'react-native'
import Post from './Post'
import Story from '../Feed/Story'
import { useRoute } from '@react-navigation/core'
import { ScrollView } from 'react-native-gesture-handler'

const LIMIT = 10;

function updateNextVisible(visible, data, LIMIT) {
    let newVisible = [];
    let count = 0;
    for (item in data) {
        if (!visible.includes(item)) {
            count++;
        }
        newVisible.push(item);
        if (count > LIMIT) {
            break;
        }
    }
    return newVisible;
}

export default function Posts({ showStory, margin, data }) {
    const [visible, setVisible] = useState([]);
    useEffect(() => {
        const newVisible = updateNextVisible(visible, data, end, LIMIT)
        setVisible(newVisible);
    }, [])

    const loadMore = () => {
        const newVisible = updateNextVisible(visible, data, end, LIMIT)
        setVisible(newVisible);
    }

    return (
        <View style={[styles.container, { marginTop: margin }]}>
            <ScrollView>
                {showStory ? <Story /> : null}
                {visible.map((item) => {
                    return (
                        <Post pid={item.pid} key={item.pid} />
                    )
                })}
                <Button title="Load More" onPress={loadMore} />
            </ScrollView>
        </View>
    )
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
        flex: 1
    }
})
