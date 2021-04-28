import { useRoute } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Button } from 'react-native'
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
        <View>
            <Text>{route.params.uid}</Text>
            {chatList.map((item) => {
                return (
                    <ChatItem data={item} key={item.ccid} />
                )
            })}
            <TextInput placeholder="Type Your Message Here"
                value={message}
                onChangeText={(mess) => setMessage(mess)}
            />
            {message.length > 0 ? <Button onPress={sendMessage} title="Send Message" /> : null}
        </View>
    )
}

const ChatItem = ({ data }) => {
    const allUser = useSelector(selectAllUser);
    const user = useSelector(selectUser)
    const time = new Date(data.time)
    if (!data) {
        return (
            <View>
                <Text>Error in Chat</Text>
            </View>
        )
    }

    if (data.type == 'post') {
        return (
            <View>
                <Text>Post with Pid: {data.content}</Text>
            </View>
        )
    }
    return (
        <View>
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