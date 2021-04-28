import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TextInput, Button } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { subPost } from '../../firebase/subscriptions';
import { addComment } from '../../firebase/functions';

export default function Comments() {
    const route = useRoute()
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
            <View>
                <Text>Loading Comments</Text>
            </View>
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

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                {data.comments.map((item) => {
                    return (
                        <CommentItem data={item} key={item.uid + "_" + item.time} />
                    )
                })}
            </ScrollView>
            <TextInput multiline={true} placeholder="Type Your Comment Here"
                value={comment}
                onChangeText={(val) => setComment(val)}
                maxLength={30}
                numberOfLines={1}
            />
            {comment.length > 0 ? <Button onPress={sendComment} title="Add Comment" /> : null}
        </View>
    )
}

const CommentItem = ({ data }) => {

    return (
        <View>
            <Text>{data.content}</Text>
            <Text>By: {data.uid}</Text>
            <Text>On: {data.time}</Text>
        </View>
    )
}