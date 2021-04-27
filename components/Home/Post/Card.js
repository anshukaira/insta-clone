import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, Image } from 'react-native'
import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base'

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
                    <Thumbnail source={profileImage}/>
                        <Body>
                            <Text onPress={openProfile}>{name}</Text>
                        </Body>
                 </Left>
            </CardItem>
            <CardItem cardBody >
                <View style ={[styles.image, { height: dimensions, width: dimensions }]}>
                    <Image source={{uri: imageUrl}} style={{ height: '100%', resizeMode: 'cover' }} />
                </View>
            </CardItem>
            <CardItem style={{height: 45}}>
                <Left>
                    <Button transparent 
                        onPress={likePost}>
                        <Icon name={liked ? "ios-heart" : "ios-heart-outline"}
                        style={{color: 'black'}}
                        />
                    </Button>
                    <Button transparent>
                        <Icon name="ios-chatbubbles-outline"
                        style={{color: 'black'}}
                        />
                    </Button>
                    <Button transparent>
                        <Icon name="send-sharp"
                        style={{color: 'black'}}
                        />
                    </Button>
                </Left>
            </CardItem>
            <CardItem style={{height : 10}}>
                <Text>{likesCount} Likes</Text>
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
    }
});