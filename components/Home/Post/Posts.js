import React from 'react'
import { View, Text } from 'react-native'
import Post from './Post'

export default function Posts() {
    return (
        <View>
            <Post p_id="123" />
            <Post p_id="158" />
        </View>
    )
}
