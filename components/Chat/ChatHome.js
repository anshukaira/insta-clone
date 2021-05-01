import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Avatar } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { initiateChat } from '../../firebase/functions'
import { selectAllUser } from '../../redux/slices/allUserSlice'
import { selectUser } from '../../redux/slices/userSlice'
import { DUMMY_DATA } from '../CONSTANTS'
import { descriptiveText } from '../Style/Common'
import { theme } from '../Style/Constants'
import Header from './Header'

export default function ChatHome() {
    const user = useSelector(selectUser)
    const navigation = useNavigation();
    useEffect(() => {
        let username = user.email.substring(0, user.email.indexOf('@'))
        navigation.setOptions({ headerShown: true, title: username })
    })
    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <Header uid={user.name} />
            <Message />
            <ScrollView>
                <ExistingList />
                <PossibleList />
            </ScrollView>
        </View>
    )
}

const Message = () => {
    return (
        <View style={styles.messageContainer}>
            <Text style={styles.messages}>Messages</Text>
        </View>
    )
}

const ExistingList = () => {
    const user = useSelector(selectUser)
    const [existing, setExisting] = useState([]);

    useEffect(() => {
        const list = getExistingList(user)
        setExisting(list)
    }, [user])

    if (existing.length == 0) {
        return (
            descriptiveText('No Existing Chats Found')
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {existing.map((item) => {
                console.log(item);
                return (
                    <ExistingListItem uid={item.uid} chatId={item.chatId} key={item.chatId} />
                )
            })}
        </View>
    )
}

const PossibleList = () => {
    const user = useSelector(selectUser)
    const [possible, setPossible] = useState([]);

    useEffect(() => {
        const list = getPossibleList(user)
        setPossible(list)
    }, [user])

    if (possible.length == 0) {
        return (
            descriptiveText('Follow users to start chating')
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {possible.map((item) => {
                return (
                    <PossibleListItem uid={item.uid} key={item.uid} />
                )
            })}
        </View>
    )
}

const ExistingListItem = ({ uid, chatId }) => {
    const allUser = useSelector(selectAllUser)
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const handlePress = () => {
        setLoading(true);
        navigation.navigate('Chat', { uid: uid, chatId: chatId, header: allUser[uid].username })
        setLoading(false);
    }

    const navigateProfile = () => {
        //ToDo: Navigate to the particular user profile
        // we dont provide this option now because of too much nesting
        navigation.navigate('Profile', { uid: uid, screen: 'Chat' })
    }
    if (loading) {
        return (
            descriptiveText('Loading Please Wait')
        )
    }
    return (

        <View style={styles.chatContainer}>
            <Avatar.Image source={DUMMY_DATA.dp} size={54} onPress={navigateProfile} />
            <TouchableOpacity onPress={handlePress}>
                <View style={styles.textContainer}>
                    <Text style={styles.name} >{allUser[uid].name}</Text>
                    <Text style={styles.smallText}>{chatId}</Text>
                </View>
            </TouchableOpacity>

        </View>
    )
}

const PossibleListItem = ({ uid }) => {
    const allUser = useSelector(selectAllUser)
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const handlePress = async () => {
        setLoading(true);
        let chatId = await initiateChat(uid);
        if (chatId !== null) {
            navigation.navigate('Chat', { uid: uid, chatId: chatId, header: allUser[uid].username })
        }
        setLoading(false);
    }
    if (loading) {
        return (
            descriptiveText('Loading Please Wait')
        )
    }
    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.chatContainer}>
                <Avatar.Image source={DUMMY_DATA.dp} size={54} />
                <View style={styles.textContainer}>
                    <Text style={styles.name} >{allUser[uid].name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function getExistingList(user) {
    let list = []
    if (!user || !user.chats) {
        return list;
    }
    for (const key in user.chats) {
        list.push({ uid: key, chatId: user.chats[key] })
    }
    return list
}

function getPossibleList(user) {
    let list = []
    if (!user || !user.following) {
        return list;
    }
    for (const uid of user.following) {
        if (!user.chats[uid]) {
            list.push({ uid: uid })
        }
    }
    return list
}

const styles = StyleSheet.create({
    messageContainer: {
        backgroundColor: theme.lightbg,
        marginTop: 75,
        padding: 8,
    },
    messages: {
        fontWeight: "bold",
        fontSize: 18
    },
    chatContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme.lightbg,
        padding: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.lightGrayBorder
    },
    textContainer: {
        marginLeft: 10
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
    },
    smallText: {
        fontSize: 10,
        color: 'grey'
    },
});