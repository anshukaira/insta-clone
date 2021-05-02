import React, { useEffect, useState } from 'react'
import { View, Text, Platform, Button, Image, TouchableOpacity, StyleSheet, ToastAndroid, TextInput } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { addPost, addPostNative } from '../../firebase/functions';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/userSlice'
import { theme } from '../Style/Constants';
import { descriptiveText } from '../Style/Common';

export default function Add() {
    const user = useSelector(selectUser);

    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

    const [uploaded, setUploaded] = useState(false)

    const [image, setImage] = useState(null)
    const [visibility, setVisibility] = useState(user.vis)
    const [caption, setCaption] = useState("Caption")

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
            descriptiveText('Waiting for permissions')
        )
    }

    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return (
            descriptiveText('Sorry we need permissions')
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
        addPost(image, caption, visibility, user.uid)
        if (Platform.OS == 'android') {
            ToastAndroid.showWithGravity(
                "Picture Uploaded!!",
                ToastAndroid.LONG,
                ToastAndroid.CENTER)
        }

        setUploaded(true)
    }

    const CustomButton = ({ onPress, text, style }) => {
        return (
            <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
                <Text style={styles.text}>{text}</Text>
            </TouchableOpacity>
        )
    }

    const ImageContainer = () => {
        return(
            <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                <TextInput placeholder='Add a Caption' onChangeText={(data) => setCaption(data)} multiline={true} style={styles.caption}/>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {image && !uploaded && ImageContainer()}
            {image && !uploaded && <CustomButton onPress={upload} text="Upload Image" style={{marginBottom : 50}}/>}
            <CustomButton
                onPress={pickImage}
                text='Pick an image from camera roll' />

            <CustomButton
                onPress={clickImage}
                text='Click an image now' />
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
        backgroundColor: theme.lightButton,
        borderRadius: 5,
        width: 250,
        padding: 10,
        margin: 10,
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: theme.darkfont,
        fontWeight: 'bold',
    },
    caption: {
        width: 250,
        minHeight: 40,
        maxHeight: 150,
        borderWidth: 0.5,
        padding: 5,
        margin: 10,
        borderRadius: 5,
    }
});
