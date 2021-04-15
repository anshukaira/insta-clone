import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker';
import CameraPermissionsWrapper from '../helper/CameraPermissionsWrapper'
import { useIsFocused } from '@react-navigation/native'


export default function Add({ navigation }) {
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const isFocused = useIsFocused();


  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <CameraPermissionsWrapper>
      <View style={{ flex: 1 }}>
        <View style={styles.cameraContainer}>
          {isFocused ? <Camera
            ref={ref => setCamera(ref)}
            style={styles.fixedRatio}
            type={type}
            ratio={'1:1'} /> : <View />}
        </View>
        <Button
          title="Flip Image"
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}>
        </Button>
        <Button title="Take Picture" onPress={() => takePicture()} />
        <Button title="Pick Image From Gallery" onPress={() => pickImage()} />
        <Button
          title="Save"
          onPress={() => navigation.navigate('Save', { image })}
        />
        {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
      </View>
    </CameraPermissionsWrapper>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  }

})