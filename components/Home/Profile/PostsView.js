import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, ScrollView } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Post from '../Post/PostMini'
import { useNavigation, useRoute } from '@react-navigation/core'
import { useSelector } from 'react-redux'
import { selectAllPosts } from '../../../redux/slices/allPostsSlice'
import { selectUser } from '../../../redux/slices/userSlice'
import { theme } from '../../Style/Constants'
import Icon from 'react-native-vector-icons/Ionicons'
import { PROFIILE_VISIBILITY } from '../../CONSTANTS'
import Loading from '../../Helper/Loading'

const Tab = createMaterialTopTabNavigator();


export default function PostsView({ user }) {

    const me = useSelector(selectUser);

    if (!me || !user || !me.uid || !user.uid || !user.vis) {
        return (
            <Loading />
        )
    }

    if (me.uid !== user.uid && (user.vis == PROFIILE_VISIBILITY.PROTECTED || user.vis == PROFIILE_VISIBILITY.PRIVATE) && !user.followers.includes(me.uid)) {
        return (
            <View style={styles.privateAccContainer}>
                <Icon name='lock-closed-outline' style={{ fontSize: 96, marginTop: 80 }} />
                <Text style={{ fontSize: 26 }}>
                    This Account is Private.
                </Text>
                <Text>
                    Follow the account to see their photos and videos.
                </Text>
            </View>
        )
    }
    return (
        <View>
            <Tab.Navigator
                initialLayout={{ width: Dimensions.get('window').width }}
                style={{ flex: 1 }}
                tabBarOptions={{ showLabel: false, showIcon: true }}
            >
                <Tab.Screen
                    name="User | Posts"
                    component={Normal}
                    options={{
                        tabBarIcon: () => (
                            <Icon name="grid-outline" size={26} />)
                    }}
                    initialParams={{ uid: user.uid }} />
            </Tab.Navigator>
        </View>
    )
}

function Normal() {
    const allPosts = useSelector(selectAllPosts);
    const [currentPostList, setCurrentPostList] = useState([]);
    const route = useRoute();
    useEffect(() => {
        if(allPosts && allPosts.loaded){
            const data = extractPostsList(allPosts, route.params.uid)
            setCurrentPostList(data)
        }
    }, [allPosts])

    return (
        <View style={{ flexDirection: 'column', backgroundColor: theme.lightbg }}>
            <View style={styles.container}>
                {currentPostList.length ? 
                currentPostList.map((item) => {
                    return (
                        <Post key={item.pid} pid={item.pid} navigateTo="Posts" style={styles.item} />
                    )
                })
                : <NoPost uid={route.params.uid}/>}
            </View>
            <CompleteProfile uid={route.params.uid}/>
        </View>

    )
}

function NoPost({ uid }){
    const me = useSelector(selectUser);

     if(me.uid != uid){
        return(
            <View style={styles.noPostContainer}>
                <View style={[styles.imgC, {borderWidth: 2, height: 70, width: 70}]}>
                    <Icon name='camera-outline' style={{ fontSize: 42}} />
                </View>
                <Text style={{fontSize: 28, marginTop: 10}}>No Posts Yet</Text>
            </View>
        )
    }
        return(
            <View style={styles.noPostContainer}>
                <Text style={{ fontSize: 28}}>Profile</Text>
                <Text style={{ fontSize: 12, textAlign: 'center'}}>When you share photos and videos, they'll appear on your profile</Text>
                <TouchableOpacity>
                    <Text style={{ color: theme.lightButton }}>Share your first photo</Text>
                </TouchableOpacity>
            </View>    
            
        )    
}

function CompleteProfile({ uid }){
    const user = useSelector(selectUser);
    const navigation = useNavigation();

    if((user.name && user.dp && user.about) || user.uid != uid)
        return null

    const iconBox = ({ name, head, desc }) => {
        return (
            <View style={[styles.box, { paddingTop: 20 }]}>
                <View style={styles.imgC}>
                    <Icon name={name} style={[styles.icon, { color: `${name == 'checkmark-circle' ? '#009e00' : 'black'}` }]} />
                </View>
                <Text style={styles.head}>{head}</Text>
                <Text style={styles.description}>{desc}</Text>
            </View>
        )
    }

    const goToEdit = () => {
        navigation.navigate('Edit', {screen:'PostView'})
    }
    
    return(
        <View style={styles.completeProfile}>
            <Text style={[styles.head]}>Complete Your Profile</Text>
            <ScrollView horizontal={true} style={{ paddingBottom : 5 }}>
                {iconBox({
                    name: `${user.name.length == 0 ? 'person-outline' : 'checkmark-circle'}`,
                    head: 'Add Your Name',
                    desc: 'Add your full name so your friends know it\'s you.',
                })}
                {iconBox({
                    name: `${user.dp.length == 0 ? 'image-outline' : 'checkmark-circle'}`,
                    head: 'Add Profile Pic',
                    desc: 'Add a profile pic to let people identify you better.'
                })}
                {iconBox({
                    name: `${user.about.length == 0 ? 'chatbubble-outline' : 'checkmark-circle'}`,
                    head: 'Add Bio',
                    desc: 'Tell your followers a little bit about yourself.',
                })}
            </ScrollView>
            <TouchableOpacity>
                <Text style={styles.button} onPress={goToEdit}>Edit Profile</Text>
            </TouchableOpacity>
        </View>
    )
}

function extractPostsList(allPosts, uid) {
    let userPosts = [];
    for (const key in allPosts) {
        if (allPosts[key].uid == uid) {
            userPosts.push({ pid: key, ...allPosts[key] })
        }
    }
    return userPosts;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    scroll: {
        // flexDirection: 'row',
        // flexWrap: 'wrap'
    },
    item: {
        backgroundColor: theme.lightbg,
        padding: 2,
    },
    privateAccContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.lightGrayBorder,
        marginTop: 10
    },
    noPostC: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    noPostContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 10,
        paddingTop: 50,
    },
    completeProfile: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        margin: 5,
        padding: 10,
        width: '100%',
    },
    boxC: {
        flexDirection: 'row',
    },
    box: {
        width: 160,
        height: 170,
        borderWidth: 1,
        borderColor: theme.lightGrayBorder,
        borderRadius: 5,
        padding: 10,
        margin: 5,
        justifyContent: "center",
        alignContent: 'center',
    },
    button: {
        backgroundColor: theme.lightButton,
        color: theme.darkfont,
        fontWeight: 'bold',
        padding: 8,
        margin: 5,
        alignSelf: 'center',
        borderRadius: 5,
    },
    imgC: {
        height: 50,
        width: 50,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 50,
    },
    icon: {
        fontSize: 30,
    },
    head: {
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 5,
    },
    description: {
        fontSize: 12,
        textAlign: 'center',
        color: 'gray'
    }

})