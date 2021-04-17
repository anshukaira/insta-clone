import React from 'react'
import { SafeAreaView } from 'react-native'
import Posts from '../Post/Posts'
import Header from './Header'
import Story from './Story'

export default function Feed() {
    return (
        <SafeAreaView>
            <Header />
            <Story />
            <Posts />
        </SafeAreaView>
    )
}
