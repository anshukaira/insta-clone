import React, { useEffect, useState } from 'react'
import { View, Platform, FlatList, StyleSheet, StatusBar, Dimensions, Text, Image, TouchableOpacity } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Post from '../Post/PostMini'
import { useRoute } from '@react-navigation/core'
import { useSelector } from 'react-redux'
import { selectAllPosts } from '../../../redux/slices/allPostsSlice'
import { selectUser } from '../../../redux/slices/userSlice'
import { theme } from '../../Style/Constants'
import Icon from 'react-native-vector-icons/Ionicons'
import { PROFIILE_VISIBILITY } from '../../CONSTANTS'


const Tab = createMaterialTopTabNavigator();


export default function PostsView({ user }) {

    const me = useSelector(selectUser);

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
        const data = extractPostsList(allPosts, route.params.uid)
        setCurrentPostList(data)
    }, [allPosts])

    return (
        <View style={styles.container}>
            {
            console.log(currentPostList.length)}
            {currentPostList.length ? 
            currentPostList.map((item) => {
                return (
                    <Post key={item.pid} pid={item.pid} navigateTo="Posts" style={styles.item} />
                )
            })
            : <NoPost />
            }
        </View>
    )
}

function NoPost(){
    // const me = useSelector(selectUser);

    //  if(me.uid != user.uid){
    //     return(
    //         <View style={styles.noPostC}>
    //                 <Image source={require('../../../assets/noPost.png')} />
    //         </View>
    //     )
    // }
        return(
            <View style={styles.noPostC}>
                <View style={styles.noPostContainer}>
                    <Text style={{ fontSize: 28}}>Profile</Text>
                    <Text style={{ fontSize: 12, textAlign: 'center'}}>When you share photos and videos, they'll appear on your profile</Text>
                    <Text style={{ color: theme.lightButton }}>Share your first photo or video</Text>
                </View>
                <View style={styles.completeProfile}>
                    <Text style={[styles.head]}>Complete Your Profile</Text>
                    <View style={styles.boxC}>
                        <View style={styles.box}>
                            <View style={styles.imgC}>
                                <Icon name='chatbubble-outline' style={styles.icon}/>
                            </View>
                            <Text style={styles.head}>Add Bio</Text>
                            <Text style={styles.description}>Tell your followers a little bit about yourself.</Text>
                        </View>
                        <View style={[styles.box, {paddingTop: 20}]}>
                            <View style={styles.imgC}>
                                <Icon name='person-outline' style={styles.icon}/>
                            </View>
                            <Text style={styles.head}>Add Your Name</Text>
                            <Text style={styles.description}>Add your full name so your friends know it's you.</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.button}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>    
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
        backgroundColor: theme.lightbg,
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 10,
    },
    completeProfile: {
        margin: 5,
        padding: 10,
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
    button : {
        backgroundColor: theme.lightButton,
        color: theme.darkfont,
        fontWeight: 'bold',
        padding: 8,
        margin: 10,
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