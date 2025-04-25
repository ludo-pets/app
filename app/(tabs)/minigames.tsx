import NailTrimGame from '@/components/minigames/nail-trim-game'
import { StyleSheet, View, Text, FlatList, Dimensions, Image, TouchableHighlight } from 'react-native'
import React from 'react';

const { width, height } = Dimensions.get('window'); 

const imgRad = 16;

const DATA = [
    {
        id: 1,
        gameTitle: 'Jogo da Unha',
        image: require('@/assets/images/minigames/minigame_icon_test.png'),
    },
    { 
        id: 2,
        gameTitle: 'Jogo da Unha 2',
        image: require('@/assets/images/minigames/minigame_icon_test.png'),
    },
    { 
        id: 3,
        gameTitle: 'Jogo da Unha 3',
        image: require('@/assets/images/minigames/minigame_icon_test.png'),
    },
    {
        id: 4,
        gameTitle: 'Jogo da Unha 4',
        image: require('@/assets/images/minigames/minigame_icon_test.png'),
    },
    { 
        id: 5,
        gameTitle: 'Jogo da Unha 5',
        image: require('@/assets/images/minigames/minigame_icon_test.png'),
    },
    { 
        id: 6,
        gameTitle: 'Jogo da Unha 6',
        image: require('@/assets/images/minigames/minigame_icon_test.png'),
    },
]
//Mudar botao play!!!
export default function MinigameScreen() {
    return (
        <View style = {styles.container}>
            <FlatList
            data={DATA}
            showsVerticalScrollIndicator = {false}
            keyExtractor = {(item) => item.id.toString()}
            renderItem = {({item}) => (
                <View style = {styles.minigameBox}>
                    <View style = {styles.imageDiv}>
                        <View style = {styles.picBox}>
                            <Image
                            resizeMode = 'cover'
                            style={{ width: '100%', height: '100%',borderRadius: imgRad}}
                            source = {item.image}/>
                        </View>
                    </View>

                    <View style = {styles.textDiv}>
                        <Text style = {styles.title}>{item.gameTitle}</Text>
                        <TouchableHighlight style = {styles.playButton}>
                            <View>
                                <Text style = {{fontSize: 15,fontWeight: '600',color: '#5B5B5B',}}> Play </Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 19,
        fontWeight: '600',
        color: '#5B5B5B',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    minigameBox: {
        //backgroundColor: '#7bb8de',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 3,
        width: width * 1,
        height: height * 0.14,
    },
    imageDiv: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    picBox: {
        backgroundColor: '#C0DFF3',
        justifyContent: 'center',
        alignItems: 'center',
        height: '86%',
        aspectRatio: 1,
        marginLeft: '2%',
        borderRadius: imgRad,
        padding: 5,
    },
    textDiv: {
        //backgroundColor: 'pink',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        position: 'absolute',
        left: '32%',
        width: '68%',
        height: '80%',
    },
    playButton: {
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
        top: '18%',
        width: '95%',
        height: '44%',
        borderRadius: 9,
        //alignSelf: 'center',
    }
    
})
