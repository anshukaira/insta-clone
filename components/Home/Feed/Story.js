import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { theme } from '../../Style/Constants'

const DATA = Array.from(Array(20), (x, index) => {
    return {
        id: 'id-p-' + index
    }
})

export default function Story() {
    return (
        <FlatList
            data={DATA}
            renderItem={StoryItem}
            keyExtractor={item => item.id}
            horizontal={true}
        />
    )
}

export function StoryItem() {
    return (
        <View style={styles.item}>
            <Text>Story</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: theme.lightbg,
        padding: 5,
        overflow: 'scroll',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#888888',
        borderRightWidth: 0,
        borderLeftWidth: 0,
    },
    item: {
        borderRadius: 40,
        borderStyle: 'solid',
        borderColor: theme.darkbg,
        borderWidth: 1,
        overflow: 'hidden',
        height: 80,
        width: 80,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        margin: 10,
    }
})
