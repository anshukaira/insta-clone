import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { initiateChat } from '../../../firebase/functions'
import { selectAllUser } from '../../../redux/slices/allUserSlice'
import { selectUser } from '../../../redux/slices/userSlice'

export default function ChatHome() {
    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <ExistingList />
                <PossibleList />
            </ScrollView>
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
            <View>
                <Text>No Existing Chats Found</Text>
            </View>
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
            <View>
                <Text>No Possible Chats Found. Follow users to start chating</Text>
            </View>
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
        navigation.navigate('Chat', { uid: uid, chatId: chatId, header: allUser[uid].name })
        setLoading(false);
    }
    if (loading) {
        return (
            <Text>Loading please wait</Text>
        )
    }
    return (
        <TouchableOpacity onPress={handlePress}>
            <Text>{allUser[uid].name}</Text>
            <Text>{chatId}</Text>
        </TouchableOpacity>
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
            navigation.navigate('Chat', { uid: uid, chatId: chatId, header: allUser[uid].name })
        }
        setLoading(false);
    }
    if (loading) {
        return (
            <Text>Loading please wait</Text>
        )
    }
    return (
        <TouchableOpacity onPress={handlePress}>
            <Text>{allUser[uid].name}</Text>
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
