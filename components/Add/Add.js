import React, { useEffect, useState } from 'react'
import { View, Text, Platform, Button, Image, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { addPost, addPostNative } from '../../firebase/functions';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/userSlice'
import { theme } from '../Style/Constants';

export default function Add() {
    const user = useSelector(selectUser);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null)
    const [uploaded, setUploaded] = useState(false)

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (galleryStatus.status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                    setHasGalleryPermission(false)
                } else {
                    setHasGalleryPermission(true);
                }
                const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
                if (cameraStatus.status !== 'granted') {
                    alert('Sorry, we need camera permissions to make this work!')
                    setHasCameraPermission(false);
                } else {
                    setHasCameraPermission(true);
                }
            } else {
                setHasCameraPermission(true)
                setHasGalleryPermission(true)
            }
        })();
    }, [])

    if (hasCameraPermission === null || hasGalleryPermission === null) {
        return (
            <View>
                <Text>Waiting for Permission</Text>
            </View>
        )
    }

    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return (
            <View>
                <Text>Sorry we need permissions</Text>
            </View>
        )
    }

    const pickImage = async () => {
        setUploaded(false);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: false
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const clickImage = async () => {
        setUploaded(false);
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const upload = () => {
        addPost(image, "Testing Post Upload", 'PUBLIC', user.uid)
        if (Platform.OS = 'android') {
            ToastAndroid.showWithGravity(
                "Picture Uploaded!!",
                ToastAndroid.LONG,
                ToastAndroid.CENTER)
        }

        setUploaded(true)
    }

    const CustomButton = ({ onPress, text }) => {
        return (
            <TouchableOpacity onPress={onPress} style={styles.button}>
                <Text style={styles.text}>{text}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <CustomButton
                onPress={pickImage}
                text='Pick an image from camera roll' />

            <CustomButton
                onPress={clickImage}
                text='Click an image now' />

            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            {image && !uploaded && <CustomButton onPress={upload} text="Upload Image" />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.lightbg,
    },
    button: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: theme.lightGrayBorder,
        width: 250,
        padding: 5,
        margin: 10,
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
    }
});
