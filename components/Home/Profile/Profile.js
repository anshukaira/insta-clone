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
    const style = user.uid === route.params.uid ? { marginTop: 50 } : { marginTop: 0 };
    const paddingTop = user.uid === route.params.uid ? { paddingTop: StatusBar.currentHeight } : { paddingTop: 0 };
    return (
        <View style={[styles.container, paddingTop]}>
            {user.uid === route.params.uid ? <Header uid={allUser[user.uid].name} /> : <></>}
            <ScrollView>
                <ProfileBox uid={route.params.uid} style={style} />
                {user.uid === route.params.uid ? <OwnBox uid={user.uid} /> : <OtherBox uid={route.params.uid} />}
                <PostsView uid={route.params.uid} />
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

