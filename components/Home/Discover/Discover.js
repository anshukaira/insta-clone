import React from 'react'
import { StyleSheet, Platform, FlatList } from 'react-native'
import { Searchbar } from 'react-native-paper'
import Post from '../Post/PostMini'

const DATA = Array.from(Array(7), (x, index) => {
    return {
        id: 'id-' + index
    }
})

export default function Discover() {
    return (
        Platform.OS === 'web' ?
            <FlatList
                data={DATA}
                renderItem={({ item }) => {
                    return <Post style={styles.listItem} p_id={item.id} />
                }}
                keyExtractor={item => item.id}
                initialNumToRender={10}
                refreshing={true}
                style={styles.list}
                ListHeaderComponent={Searchbar}
                numColumns={5}
                columnWrapperStyle={styles.col}
            /> :
            <FlatList
                data={DATA}
                renderItem={({ item }) => {
                    return <Post style={styles.listItem} p_id={item.id} />
                }}
                keyExtractor={item => item.id}
                initialNumToRender={10}
                refreshing={true}
                style={styles.list}
                ListHeaderComponent={Story}
                numColumns={3}
                columnWrapperStyle={styles.col}
            />
    )
}

const styles = StyleSheet.create({
    list: {
        marginTop: 0,
    },
    col: {
        justifyContent: 'flex-start',
    },
    listItem: {
        margin: 10
    }
})