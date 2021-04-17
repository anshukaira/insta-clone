import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native'

const window = Dimensions.get("window");
const divide = 2.5;
const initialWidth = Platform.OS === 'web' ? window.width / divide : window.width;

export default function Post({ p_id }) {
    const navigation = useNavigation();
    const [dimensions, setDimensions] = useState(initialWidth);

    const onChange = ({ window }) => {
        if (Platform.OS == 'web')
            setDimensions(window.width / divide);
        else
            setDimensions(window.width);
    };

    useEffect(() => {
        Dimensions.addEventListener("change", onChange);
        return () => {
            Dimensions.removeEventListener("change", onChange);
        };
    });

    const openProfile = () => {
        navigation.navigate("Profile", { p_id: p_id, u_id: "test" })
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text onPress={openProfile} >@slayeransh</Text>
            </View>
            <View style={[styles.image, { height: dimensions, width: dimensions }]}></View>
            <View style={styles.footer}>
                <Text>I am footer for caption</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        paddingTop: 10,
        paddingBottom: 10
    },
    header: {
        flexDirection: 'row',
        padding: 5,
    },
    image: {
        flexDirection: 'column',
        backgroundColor: 'green'
    },
    footer: {
        flexDirection: 'column',
        padding: 5,
    }
})