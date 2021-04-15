import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    Platform,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from 'expo-image-picker';

export default function CameraPermissionsWrapper({ children }) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS == "web") {
                setHasCameraPermission(true);
                setHasGalleryPermission(true);
                return;
            }
            const cameraStatus = await Camera.requestPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === "granted");
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted')
        })();
    }, []);

    if (hasCameraPermission === null || hasGalleryPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    }
    if (hasGalleryPermission === false) {
        return <Text>No access to Gallery</Text>;
    }

    return <>{children}</>;
}