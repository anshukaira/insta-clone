import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import Post from './Post'
import Story from '../Feed/Story'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation, useRoute } from '@react-navigation/core'
import { Button, Icon } from 'native-base'

const LIMIT = 2;

function updateNextVisible(visible, data, LIMIT) {
    let newVisible = [];
    let count = 0;
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

export default function Posts({ showStory, margin, data }) {
    const [visible, setVisible] = useState([]);
    const [showLoad, setShowLoad] = useState(true);
    const route = useRoute();

    useEffect(() => {
        let newVisible = []
        if (route.params?.screen == 'PostMini') {
            newVisible = updateNextVisible(visible, route.params.data, LIMIT);
            setShowLoad(newVisible.length < route.params.data.length)
        } else {
            newVisible = updateNextVisible(visible, data, LIMIT)
            setShowLoad(newVisible.length < data.length)
        }
        setVisible(newVisible);
    }, [data])
    const loadMore = () => {
        let newVisible = []
        if (route.params?.screen == 'PostMini') {
            newVisible = updateNextVisible(visible, route.params.data, LIMIT);
            setShowLoad(newVisible.length < route.params.data.length)
        } else {
            newVisible = updateNextVisible(visible, data, LIMIT)
            setShowLoad(newVisible.length < data.length)
        }
        setVisible(newVisible);
    }

    return (
        <View style={[styles.container, { marginTop: margin }]}>
            <ScrollView contentContainerStyle={styles.scroll}>
                {showStory ? <Story /> : null}
                {visible.map((item) => {
                    return (
                        <Post pid={item.pid} key={item.pid} />
                    )
                })}

            
            {showLoad ? 
                    <Button transparent
                            onPress={loadMore} >
                            <Icon 
                                name="add-circle-outline"
                                style={{color: 'black'}}/>
                    </Button> 
                    
                  : null}
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
        flex: 1,
        backgroundColor : 'white',
    },
    scroll: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly'
    }
})
