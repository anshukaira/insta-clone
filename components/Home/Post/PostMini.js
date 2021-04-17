import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native'

const window = Dimensions.get("window");
const divideBig = 5.5;
const divideSmall = 3.5;
const initialWidth = Platform.OS === 'web' ? window.width / divideBig : window.width / divideSmall;

export default function PostMini({ p_id, style }) {
    const navigation = useNavigation();
    const [dimensions, setDimensions] = useState(initialWidth);

    const onChange = ({ window }) => {
        if (Platform.OS == 'web')
            setDimensions(window.width / divideBig);
        else
            setDimensions(window.width / divideSmall);
    };

    useEffect(() => {
        Dimensions.addEventListener("change", onChange);
        return () => {
            Dimensions.removeEventListener("change", onChange);
        };
    });

    const openRelatedPosts = () => {
        navigation.navigate("Explore", { p_id: p_id, u_id: "test" })
    }
    return (
        <TouchableOpacity onPress={openRelatedPosts} style={[styles.image, { height: dimensions, width: dimensions }, style]}></TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    image: {
        flexDirection: 'column',
        backgroundColor: 'green'
    },
})