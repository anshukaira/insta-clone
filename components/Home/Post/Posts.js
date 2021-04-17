import React from 'react'
import { Platform, StyleSheet, FlatList } from 'react-native'
import Post from './Post'
import Story from '../Feed/Story'

const DATA = Array.from(Array(7), (x, index) => {
    return {
        id: 'id-' + index
    }
})



export default function Posts({ showStory }) {
    return (
        Platform.OS === 'web' ?
            <FlatList
                data={DATA}
                renderItem={({ item }) => {
                    return <Post p_id={item.id} />
                }}
                keyExtractor={item => item.id}
                initialNumToRender={10}
                refreshing={true}
                style={styles.list}
                ListHeaderComponent={showStory ? Story : null}
                numColumns={2}
                columnWrapperStyle={styles.col}
                ListHeaderComponentStyle={styles.header}
            /> :
            <FlatList
                data={DATA}
                renderItem={({ item }) => {
                    return <Post pid={item.id} />
                }}
                keyExtractor={item => item.id}
                initialNumToRender={10}
                refreshing={true}
                style={styles.list}
                ListHeaderComponent={showStory ? Story : null}
                ListHeaderComponentStyle={styles.header}
                numColumns={1}
            />
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
        marginTop: 50
    }
})
