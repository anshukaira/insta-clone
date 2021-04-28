import { useRoute } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import { addMessage } from '../../../firebase/functions'
import { subChat } from '../../../firebase/subscriptions'
import { selectAllUser } from '../../../redux/slices/allUserSlice'
import { selectUser } from '../../../redux/slices/userSlice'

export default function Chat() {
    const route = useRoute()
    const [data, setData] = useState(null)
    const [chatList, setChatList] = useState([]);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

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

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <Text style={{ alignSelf: 'center' }}>{route.params.uid}</Text>
                {chatList.map((item) => {
                    return (
                        <ChatItem data={item} key={item.ccid} />
                    )
                })}
            </ScrollView>
            <TextInput style={styles.sendInput} multiline={true} placeholder="Type Your Message Here"
                value={message}
                onChangeText={(mess) => setMessage(mess)}
                maxLength={30}
                numberOfLines={1}
            />
            {message.length > 0 ? <Button onPress={sendMessage} title="Send Message" /> : null}
        </View>
    )
}

const ChatItem = ({ data }) => {
    const allUser = useSelector(selectAllUser);
    const user = useSelector(selectUser)
    const time = new Date(data.time)

    const alignDirection = data.uid == user.uid ? 'flex-start' : 'flex-end';

    if (!data) {
        return (
            <View style={[styles.chatItem, { alignSelf: alignDirection }]}>
                <Text>Error in Chat</Text>
            </View>
        )
    }

    if (data.type == 'post') {
        return (
            <View style={[styles.chatItem, { alignSelf: alignDirection }]}>
                <Text>Post with Pid: {data.content}</Text>
            </View>
        )
    }
    return (
        <View style={[styles.chatItem, { alignSelf: alignDirection }]}>
            <Text>{data.content}</Text>
            <Text>Sender: {data.uid == user.uid ? "ME" : allUser[data.uid].name} at {time.toLocaleString()}</Text>
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
            ccid: data[key].ccid,
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
        backgroundColor: 'green',
        padding: 10,
        width: Dimensions.get('window').width / 1.5,
        margin: 5,
        borderRadius: 10
    },
    sendInput: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        borderRadius: 5,
        padding: 10,
        margin: 5,
        borderWidth: 1
    }
})