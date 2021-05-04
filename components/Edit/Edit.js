import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native'
import { Avatar, Checkbox } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/userSlice';
import { DUMMY_DATA, PROFIILE_VISIBILITY } from '../CONSTANTS';
import { theme } from '../Style/Constants';
import * as ImagePicker from 'expo-image-picker'
import { updateDp } from '../../firebase/functions';
import { useNavigation } from '@react-navigation/native'
import { updateProfile } from '../../firebase/functions';


export default function Edit() {

    const user = useSelector(selectUser);
    const navigation = useNavigation();

    const [name, setName] = useState(user.name);
    const [about, setAbout] = useState(user.about);
<<<<<<< HEAD
    const [vis, setVis] = useState(user.vis);
    const [checked, setChecked] = useState(vis == PROFIILE_VISIBILITY.PROTECTED);
    const [displayPic, setDisplayPic] = useState(require('../../assets/dummy.jpeg'))
    
    const editUserInfo = () => {

        updateDp(displayPic);
        console.log('data is', vis);
        setVis(checked ? PROFIILE_VISIBILITY.PROTECTED : PROFIILE_VISIBILITY.PUBLIC);
=======
    const [checked, setChecked] = useState(user.vis == PROFIILE_VISIBILITY.PROTECTED);

    const editUserInfo = () => {
        let visibility = checked ? PROFIILE_VISIBILITY.PROTECTED : PROFIILE_VISIBILITY.PUBLIC;
        let data = {
            name: name,
            about: about,
            vis: visibility
        }
        updateProfile(data);
        navigation.goBack()
>>>>>>> bad845b... New firebase Management
    }

    const changeDP = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: false
        });

        if(!result.cancelled) {
            setDisplayPic(displayPic);
        }       
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <View>
<<<<<<< HEAD
                <View style={styles.row}>
                <Avatar.Image source={displayPic} />
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text onPress={changeDP} style={styles.changedp}>Change Profile Photo</Text>
                </View>
            </View>

            <View style={styles.row}>
                <Text style={[styles.label, {paddingBottom: 25}]}>Name</Text>
                <View style={[styles.nameContainer, {width: 300}]}>
                    <TextInput 
                        placeholder='Name'
                        value={name}
                        onChangeText={(data) => setName(data)}
                        style={styles.textBox}
                    />
                    <Text style={styles.description}>Help people discover your account by using the name you're known by.</Text>
                </View>
            </View>
=======
                    <View style={styles.row}>
                        <Avatar.Image source={{ uri: user.dp ? user.dp : DUMMY_DATA.dp }} />
                        <View style={styles.nameContainer}>
                            <Text style={styles.name}>{name}</Text>
                            <Text onPress={changeDP} style={styles.changedp}>Change Profile Photo</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, { paddingBottom: 25 }]}>Name</Text>
                        <View style={[styles.nameContainer, { width: 300 }]}>
                            <TextInput
                                placeholder='Name'
                                value={name}
                                onChangeText={(data) => setName(data)}
                                style={styles.textBox}
                            />
                            <Text style={styles.description}>Help people discover your account bu using the name you're known by.</Text>
                        </View>
                    </View>
>>>>>>> bad845b... New firebase Management

                    <View style={styles.row}>
                        <Text style={[styles.label, { paddingLeft: 16 }]}>Bio</Text>
                        <View style={[styles.nameContainer, { width: 300 }]}>
                            <TextInput
                                placeholder='About yourself'
                                value={about}
                                onChangeText={(data) => setAbout(data)}
                                style={styles.textBox}
                            />
                        </View>
                    </View>
                </View>


                <View>
                    <View style={[styles.col, { marginTop: 34 }]}>
                        <View style={styles.row}>
                            <Checkbox
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setChecked(!checked)
                                }}
                                color={theme.lightButton}
                            />
                            <Text style={styles.label}>Private Account</Text>
                        </View>

                        <Text style={styles.description}>When your account is private, only people you approve can see your photos and videos on Mirai~C.</Text>
                    </View>

                    <View style={{ padding: 16 }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => editUserInfo()}
                        >
                            <Text style={styles.text}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </View>


    )
}

const { width: WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create(
    {
        mainContainer: {
            height: '100%',
            width: '100%',
            backgroundColor: theme.lightbg,
            justifyContent: Platform.OS == 'web' ? 'center' : 'flex-start',
            alignItems: Platform.OS == 'web' ? 'center' : 'flex-start',
        },
        container: {
            // height: 600,
            width: 400,
            backgroundColor: theme.lightbg,
            padding: 20,
            borderWidth: Platform.OS == 'web' ? 0.5 : 0,
            borderColor: theme.lightGrayBorder,
            justifyContent: Platform.OS == 'web' ? 'space-between' : 'flex-start',
        },
        row: {
            flexDirection: 'row',
        },
        nameContainer: {
            flexDirection: 'column',
            margin: 10,
            alignSelf: "flex-end",
        },
        name: {
            fontSize: 22,
        },
        changedp: {
            fontSize: 14,
            color: theme.lightButton,
            fontWeight: 'bold',
        },
        textBox: {
            width: 280,
            height: 38,
            borderWidth: 1,
            borderColor: theme.lightGrayBorder,
            borderRadius: 5,
            fontSize: 16,
            color: theme.lightfont,
            padding: 10,
        },
        description: {
            fontSize: 12,
            color: 'gray',
            flexWrap: 'wrap'
        },
        label: {
            fontWeight: 'bold',
            alignSelf: 'center'
        },
        button: {
            width: 100,
            height: 40,
            borderRadius: 5,
            backgroundColor: theme.lightButton,
            justifyContent: 'center',
            alignSelf: 'center',
        },
        text: {
            color: theme.darkfont,
            fontSize: 16,
            textAlign: 'center',
            fontWeight: 'bold'
        },
    });