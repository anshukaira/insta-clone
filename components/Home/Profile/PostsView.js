import React from 'react'
import { View, Platform, FlatList, StyleSheet, StatusBar, Dimensions } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Post from '../Post/PostMini'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/slices/userSlice'

const DATA = Array.from(Array(7), (x, index) => {
    return {
        id: 'id-' + index
    }
})

const Tab = createMaterialTopTabNavigator();
export default function PostsView({ uid }) {
    return (
        <View>
            <Tab.Navigator initialLayout={{ width: Dimensions.get('window').width }}>
                <Tab.Screen name="Normal" component={Normal} />
                <Tab.Screen name="Normal2" component={Normal} />
            </Tab.Navigator>
        </View>
    )
}

function Normal(params) {
    return (
        Platform.OS === 'web' ?
            <FlatList
                data={DATA}
                renderItem={({ item }) => {
                    return <Post style={styles.listItem} p_id={item.id} navigateTo="Posts" />
                }}
                keyExtractor={item => item.id}
                initialNumToRender={10}
                refreshing={true}
                style={styles.list}
                numColumns={5}
                columnWrapperStyle={styles.col}
            /> :
            <FlatList
                data={DATA}
                renderItem={({ item }) => {
                    return <Post style={styles.listItem} p_id={item.id} navigateTo="Posts" />
                }}
                keyExtractor={item => item.id}
                initialNumToRender={10}
                refreshing={true}
                style={styles.list}
                numColumns={3}
                columnWrapperStyle={styles.col}
            />
    )
}

const styles = StyleSheet.create({
    list: {
        marginTop: StatusBar.currentHeight,
    },
    col: {
        justifyContent: 'flex-start',
    },
    listItem: {
        margin: 10
    }
})