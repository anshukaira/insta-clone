import React from 'react'
import { Image, View } from 'react-native'
import { LOGO } from '../CONSTANTS'

export default function Loading() {
    return (
        <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={LOGO} style={{ width: 100, height: 100, resizeMode: 'cover' }} />
        </View>
    )
}
