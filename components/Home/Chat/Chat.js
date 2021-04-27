import { useRoute } from '@react-navigation/core'
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'

export default function Chat() {
    const route = useRoute()

    useEffect(() => {

    }, [])

    return (
        <View>
            <Text>{route.params.uid}</Text>
        </View>
    )
}
