import React from 'react'
import { View, Platform, StyleSheet, FlatList } from 'react-native'
import Post from './Post'
import Story from '../Feed/Story'
import { useRoute } from '@react-navigation/core'


export default function Posts({ showStory, margin, data }) {
    const route = useRoute();
    console.log("route", route.params)
    if (Platform.OS === 'web') {
        return (
            <View style={[styles.container, { marginTop: margin }]}>
                <FlatList
                    data={data}
                    renderItem={({ item }) => {
                        return <Post pid={item.pid} key={item.pid} />
                    }}
                    keyExtractor={item => item.pid}
                    // initialNumToRender={5}
                    refreshing={true}
                    style={styles.list}
                    ListHeaderComponent={showStory ? Story : null}
                    numColumns={2}
                    windowSize={21}
                    columnWrapperStyle={styles.col}
                    ListHeaderComponentStyle={styles.header}
                />
            </View>
        )
    }
    return (
        <View style={[styles.container, { marginTop: margin }]}>
            <FlatList
                data={data}
                renderItem={({ item }) => {
                    return <Post pid={item.pid} />
                }}
                keyExtractor={item => item.pid}
                // initialNumToRender={10}
                refreshing={true}
                style={styles.list}
                windowSize={21}
                ListHeaderComponent={showStory ? Story : null}
                ListHeaderComponentStyle={styles.header}
                numColumns={1}
            />
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
