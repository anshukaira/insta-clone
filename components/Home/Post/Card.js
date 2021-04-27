import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, Image } from 'react-native'
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'
import { findNonSerializableValue } from '@reduxjs/toolkit';

const window = Dimensions.get("window");
const divide = 2.5;
const initialWidth = Platform.OS === 'web' ? window.width / divide : window.width;

export default function CardComponent({props}) {
    const { name, profileImage, date, imageUrl, caption, likes, comments } = props
    const [dimensions, setDimensions] = useState(initialWidth);

    const [liked, setLiked] = useState(false)
    const [likesCount, setlikesCount] = useState(likes)
    const likePost = () => {
        setLiked(!liked)
        setlikesCount(liked ? likesCount-1 : likesCount+1)
    }

    return (
        <Card style={styles.container} transparent>
            <CardItem>
                <Left>
                    <Thumbnail small source={{uri : imageUrl}}/>
                        <Body>
                            <Text style={styles.boldText}>{name}</Text>
                        </Body>
                 </Left>
            </CardItem>
            <CardItem cardBody >
                <View style ={[styles.image, { height: dimensions, width: dimensions }]}>
                    <Image source={{uri: imageUrl}} style={{ height: '100%', resizeMode: 'cover' }} />
                </View>
            </CardItem>
            <CardItem style={{height: 40}}>
                <Left>
                    <Button transparent 
                        onPress={likePost}>
                        <Icon name={liked ? "ios-heart" : "ios-heart-outline"}
                        style={liked ? {color :'red', fontSize: 28 } : [styles.black, {fontSize: 28}]}
                        />
                    </Button>
                    <Button transparent>
                        <Icon name="chatbubble-outline"
                        style={styles.black}
                        />
                    </Button>
                    <Button transparent>
                        <Icon 
                            name="send-sharp"
                            style={styles.black}
                        />
                    </Button>
                </Left>
            </CardItem>
            <CardItem style={styles.likeContainer}>
                <Text style={styles.boldText}>{likesCount} likes</Text>
            </CardItem>
            <CardItem style={{height : 10}}>
                <Text>{caption}</Text>
            </CardItem>
            {/* <CardItem>
                <Body>
                    <Text>{comments}</Text>
                </Body>
            </CardItem> */}
        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',

    },
    image: {
        flexDirection: 'column',
    },
    boldText: {
        fontWeight: 'bold',
    },
    black: {
      color : 'black',
      fontSize : 24,  
    },
    likeContainer: {
        height: 0,
    }
});