import React from 'react'
import { Platform, StyleSheet, FlatList } from 'react-native'
import Post from './Post'
import Story from '../Feed/Story'

const DATA = Array.from(Array(7), (x, index) => {
    return {
        id: 'id-' + index
    }
})


export default function Posts() {
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
                ListHeaderComponent={Story}
                numColumns={2}
                columnWrapperStyle={styles.col}
            /> :
            <FlatList
                data={DATA}
                renderItem={({ item }) => {
                    return <Post p_id={item.id} />
                }}
                keyExtractor={item => item.id}
                initialNumToRender={10}
                refreshing={true}
                style={styles.list}
                ListHeaderComponent={Story}
                numColumns={1}
            />
    )
}

const styles = StyleSheet.create({
    list: {
        marginTop: 50,
    },
    col: {
        justifyContent: 'space-around',
    }
})
