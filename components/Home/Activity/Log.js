import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/slices/userSlice'
import { theme } from '../../Style/Constants';

export default function Log() {
    const user = useSelector(selectUser);

    return (
        <View style={{backgroundColor: theme.lightbg}}>
            {user.activity.map((item) => {
                return (
                    <LogItem content={item.content} time={item.time} key={item.time} />
                )
            })}
        </View>
    )
}

function LogItem({ content, time }) {
    const date = new Date(time);
    return (
        <View style={styles.itemcontainer}>
            <View style={styles.messageContainer}>
                <Text style={styles.message}>{content}</Text>
            </View>
            <View style={styles.timeContainer}>
                <Text style={styles.time}>{date.toLocaleString()}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    itemcontainer: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        backgroundColor: theme.lightbg,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.lightGrayBorder,
    },
    messageContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    message: {
        textAlign: 'center',
        fontSize: 18
    },
    timeContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 5
    },
    time: {
        textAlign: 'right',
        fontSize: 12
    }
})