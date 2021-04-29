import { useRoute } from '@react-navigation/core'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TextInput, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import { addMessage } from '../../../firebase/functions'
import { subChat } from '../../../firebase/subscriptions'
import { selectAllUser } from '../../../redux/slices/allUserSlice'
import { selectUser } from '../../../redux/slices/userSlice'
import { theme } from '../../Style/Constants'
import DummyImage from '../../../assets/dummy.jpeg'

export default function Chat() {
    const route = useRoute()
    const [data, setData] = useState(null)
    const [chatList, setChatList] = useState([]);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const scrollViewRef = useRef();


    useEffect(() => {
        const unsubscribe = subChat(route.params.chatId, setData)
        return () => {
            console.log("unsubcribed chat: " + route.params.chatId)
            unsubscribe();
        }
    }, [route])

    useEffect(() => {
        let list = getChatList(data);
        setChatList(list);
    }, [data])


    const sendMessage = async () => {
        if (sending) {
            console.log("Already sending please wait");
            return
        }
        if (message.length == 0) {
            console.log("Write some message to send");
            return;
        }
        setSending(true);
        let data = {
            content: message,
            toccid: '',
            type: 'normal'
        }
        await addMessage(route.params.chatId, data, setSending)
        setMessage("")
    }

    const iconColor = message.length > 0 ? theme.lightButton : 'gray';

    return (
        <View style={{ flex: 1, backgroundColor: theme.lightbg }}>
            <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                <Text style={{ alignSelf: 'center', color: 'gray', fontSize: 12 }}>{route.params.uid}</Text>
                {chatList.map((item) => {
                    return (
                        <ChatItem data={item} key={item.ccid} keyId={item.ccid} />
                    )
                })}
            </ScrollView>
            <View style={styles.sendMessageContainer}>
                <TextInput style={styles.sendInput} multiline={true} placeholder="Type Your Message Here"
                    value={message}
                    onChangeText={(mess) => setMessage(mess)}
                    maxLength={30}
                    numberOfLines={1}
                />
                <TouchableOpacity onPress={sendMessage}
                    disabled={message.length === 0}
                    style={{ alignSelf: 'flex-end', borderRadius: 50, borderWidth: 2, marginBottom: 10, borderColor: iconColor }}>
                    <Icon name="send" style={[styles.icon, { color: iconColor }]} />
                </TouchableOpacity>
            </View>

        </View>
    )
}

const ChatItem = ({ data, keyId }) => {
    const allUser = useSelector(selectAllUser);
    const user = useSelector(selectUser)
    const time = new Date(data.time)

    const userAvatar = () => {
        if (data.uid == user.uid)
            return null
        return (<Avatar.Image source={DummyImage} size={42} style={{ marginTop: 10 }} key={keyId} />)

    }

    const alignDirection = data.uid == user.uid ? 'flex-end' : 'flex-start';
    const borderBottomRadius = data.uid == user.uid ? { borderBottomEndRadius: 5 } : { borderBottomLeftRadius: 35 };
    const viewStyle = data.uid == user.uid ? null : styles.vStyle
    const backgroundColor = data.uid == user.uid ? { backgroundColor: '#623FD7' } : { backgroundColor: 'lightgray' }
    const colorText = data.uid == user.uid ? null : { color: theme.lightfont }
    if (!data) {
        return (
            <View style={[styles.chatItem, { alignSelf: alignDirection }, borderBottomRadius, backgroundColor]}>
                <Text style={[styles.chatText, colorText]}>Error in Chat</Text>
            </View>
        )
    }

    if (data.type == 'post') {
        return (
            <View style={[styles.chatItem, { alignSelf: alignDirection }, borderBottomRadius, backgroundColor]}>
                <Text style={[styles.chatText, colorText]}>Post with Pid: {data.content}</Text>
            </View>
        )
    }
    return (
        <View style={viewStyle}>
            {userAvatar()}
            <View style={[styles.chatItem, { alignSelf: alignDirection }, borderBottomRadius, backgroundColor]}>
                <Text style={[styles.chatText, colorText]}>{data.content}</Text>
                {/* <Text style={styles.chatTextSmall}>Sender: {data.uid == user.uid ? "ME" : allUser[data.uid].name} at  */}
                <Text style={[styles.chatTextSmall, colorText]}>{time.toLocaleString()}</Text>
            </View>
        </View>

    )
}

function getChatList(data) {
    let list = [];
    if (!data) {
        return list;
    }
    for (const key in data) {
        if (key == 'subscribed') {
            continue;
        }
        list.push({
            ccid: key,
            content: data[key].content,
            time: data[key].time,
            toccid: data[key].toccid,
            type: data[key].type,
            uid: data[key].uid
        })
    }
    list.sort((a, b) => a.time > b.time)
    return list
}

const styles = StyleSheet.create({
    chatItem: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 12,
        paddingLeft: 18,
        paddingRight: 18,
        paddingBottom: 10,
        width: Dimensions.get('window').width / 1.5,
        margin: 5,
        borderRadius: 35,
    },
    vStyle: {
        flexDirection: 'row',
    },
    chatText: {
        color: theme.darkfont,
        fontWeight: 'bold'
    },
    chatTextSmall: {
        marginTop: 2,
        color: theme.darkfont,
        fontSize: 8,
    },
    sendInput: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        borderRadius: 10,
        borderColor: theme.lightGrayBorder,
        padding: 10,
        margin: 5,
        borderWidth: 1,
        width: Dimensions.get('window').width - 60,
    },
    icon: {
        fontSize: 28,
        padding: 3,
        paddingLeft: 7,
    },
    sendMessageContainer: {
        flexDirection: 'row',
    }
})