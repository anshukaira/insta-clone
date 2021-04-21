import React from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/slices/userSlice'
import { theme } from '../../Style/Constants'
import Header from './Header'
import ProfileBox from './ProfileBox'
import { OwnBox, OtherBox } from './OpBox'
import PostsView from './PostsView'
import { ScrollView } from 'react-native-gesture-handler'
import { selectAllUser } from '../../../redux/slices/allUserSlice'

export default function Profile({ route }) {
    const user = useSelector(selectUser)
    const allUser = useSelector(selectAllUser)
    const style = route.params.screen == 'Post' ? { marginTop: 0 } : { marginTop: 50 };
    const paddingTop = route.params.screen == 'Post' ? { paddingTop: 0 } : { paddingTop: StatusBar.currentHeight };
    return (
        <View style={[styles.container, paddingTop]}>
            {route.params.screen == 'Home' ? <Header uid={allUser[user.uid].name} /> : <></>}
            <ScrollView>
                <ProfileBox uid={route.params.uid} style={style} />
                {route.params.screen == 'Home' ? <OwnBox uid={user.uid} /> : <OtherBox uid={route.params.uid} />}
                <PostsView uid={route.params.uid} navigateTo="Posts" />
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

