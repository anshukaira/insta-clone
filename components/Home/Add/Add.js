import React, { useEffect, useState } from 'react'
import { View, Text, Platform, Button, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { addPost } from '../../../firebase/functions';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/slices/userSlice'

export default function Add() {
    const user = useSelector(selectUser);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null)

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
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            <Button title="Click An Image" onPress={clickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            {image && <Button onPress={upload} title="Upload Image" />}
        </View>
    )
}
