import React, { useEffect, useState } from 'react'
import { View, StyleSheet, StatusBar, Text, ScrollView, ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/slices/userSlice'
import { theme } from '../../Style/Constants'
import Header from './Header'
import ProfileBox from './ProfileBox'
import { OwnBox, OtherBox } from './OpBox'
import PostsView from './PostsView'
import { subAnotherUser } from '../../../firebase/subscriptions'
import { useNavigation, useRoute } from '@react-navigation/core'
import Loading from '../../Helper/Loading'

export default function Profile() {
    const user = useSelector(selectUser)
    const route = useRoute()
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useState(null);

    const style = route.params.screen == 'Home' ? { marginTop: 50 } : { marginTop: 0 };
    const paddingTop = route.params.screen == 'Home' ? { paddingTop: StatusBar.currentHeight } : { paddingTop: 0 };

    useEffect(() => {
        if (route.params.uid !== user.uid) {
            const unSubCurrentUser = subAnotherUser(route.params.uid, setCurrentUser);
            return () => {
                console.log("unsubscribed current user " + route.params.uid)
                unSubCurrentUser();
            }
        }
    }, [])

    useEffect(() => {
        if (route.params.screen != 'Home') {
            navigation.setOptions({
                headerShown: true,
                title: route.params.username
            })
        }
    }, [])

    useEffect(() => {
        if (route.params.uid == user.uid) {
            console.log("Hey its my profile so already subscribed")
            setCurrentUser(user);
        }
    }, [user])

    if (currentUser == null) {
        return (
            <Loading/>
        )
    }
    const username = currentUser.email.substring(0, currentUser.email.indexOf('@'))
    
    return (
        <View style={[styles.container, paddingTop]}>
            {route.params.screen == 'Home' ? <Header username={username} /> : null}
            <ScrollView>
                <ProfileBox user={currentUser} style={style} />
                {route.params.screen == 'Home' ? <OwnBox user={currentUser} /> : <OtherBox user={currentUser} />}
                <PostsView user={currentUser} navigateTo="Posts" />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.lightbg,
        color: theme.lightfont,
        justifyContent: 'flex-start',
        flexDirection: 'column',
    }
})

