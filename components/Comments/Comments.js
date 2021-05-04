import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TextInput, Button, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { subPost } from '../../firebase/subscriptions';
import { addComment } from '../../firebase/functions';
import { theme } from '../Style/Constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/userSlice';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import { descriptiveText } from '../Style/Common';
import { selectAllUser } from '../../redux/slices/allUserSlice';
import { DUMMY_DATA } from '../CONSTANTS';

export default function Comments() {
    const route = useRoute()
    const user = useSelector(selectUser)
    const [data, setData] = useState(null);
    const [comment, setComment] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const unsubscribe = subPost(route.params.uid, route.params.pid, setData);
        return () => {
            console.log("Unsubscribed Post: " + route.params.pid);
            unsubscribe();
        }
    }, [])

    if (data === null || !data.comments) {
        return (
            descriptiveText('Loading Comments')
        )
    }

    const sendComment = async () => {
        if (sending) {
            console.log("Please Wait uploading previous comment");
            return;
        }
        setSending(true);
        await addComment(route.params.uid, route.params.pid, comment, setSending);
        setComment("")
    }

    const iconColor = comment.length > 0 ? theme.lightButton : 'lightblue';

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                {data.comments.map((item) => {
                    return (
                        <CommentItem data={item} key={item.uid + "_" + item.time} />
                    )
                })}
            </ScrollView>

            <View style={styles.sendMessageContainer}>
                <TextInput style={styles.sendInput} multiline={true} placeholder={`Comment as ${user.name}`}
                    value={comment}
                    onChangeText={(val) => setComment(val)}
                    maxLength={30}
                    numberOfLines={1}
                />
                <TouchableOpacity onPress={sendComment}
                    disabled={comment.length === 0}
                    style={{ alignSelf: 'flex-end', marginBottom: 16 }}>
                    <Text style={[styles.icon, { color: iconColor }]}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const CommentItem = ({ data }) => {
    const allUsers = useSelector(selectAllUser)
    const date = new Date(data.time);
    
    if (!allUsers || !allUsers[data.uid]) {
        return null
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <Avatar.Image source={{ uri: allUsers[data.uid].dp ? allUsers[data.uid].dp : DUMMY_DATA.dp }} size={46} />
                <View style={styles.commentStyle}>
                    <View style={styles.commentLine}>
                        <Text style={styles.username}>@{allUsers[data.uid].username} </Text>
                        <Text>{data.content}</Text>
                    </View>
                    <Text style={styles.smallText}>{date.toLocaleString()}</Text>
                </View>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Icon name="heart-outline" style={{ color: 'black', fontSize: 18 }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sendInput: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 10,
        margin: 2,
        width: Dimensions.get('window').width - 80,
    },
    sendMessageContainer: {
        flexDirection: 'row',
        marginBottom: 4,
        padding: 4,
        borderTopWidth: 1,
        borderColor: theme.lightGrayBorder,
    },
    icon: {
        fontSize: 18,
        padding: 4,
        paddingLeft: 8,
        fontWeight: "bold"
    },
    container: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: theme.lightbg,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.lightGrayBorder,
        justifyContent: 'space-between'
    },
    username: {
        fontWeight: "bold",
    },
    commentStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        marginBottom: 4
    },
    commentLine: {
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },
    smallText: {
        color: 'silver',
        fontSize: 12,
        alignSelf: 'flex-start',
        paddingTop: 4
    }
});