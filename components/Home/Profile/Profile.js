import React, { useEffect, useState } from 'react'
import { View, StyleSheet, StatusBar, Text, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/slices/userSlice'
import { theme } from '../../Style/Constants'
import Header from './Header'
import ProfileBox from './ProfileBox'
import { OwnBox, OtherBox } from './OpBox'
import PostsView from './PostsView'
import { subAnotherUser } from '../../../firebase/subscriptions'

export default function Profile({ route }) {
    const user = useSelector(selectUser)

    const style = (route.params.screen == 'Post' ||
        route.params.screen == 'Activity') ? { marginTop: 0 } : { marginTop: 50 };

    const paddingTop = (route.params.screen == 'Post' ||
        route.params.screen == 'Activity') ? { paddingTop: 0 } : { paddingTop: StatusBar.currentHeight };

    const [currentUser, setCurrentUser] = useState(null);
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
        if (route.params.uid == user.uid) {
            console.log("Hey its my profile so already sunscribed")
            setCurrentUser(user);
        }
    }, [user])

    if (currentUser == null) {
        return (
            <View>
                <Text>
                    Loading...
                </Text>
            </View>
        )
    }

    return (
        <View style={[styles.container, paddingTop]}>
            {route.params.screen == 'Home' ? <Header uid={currentUser.name} /> : <></>}
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

