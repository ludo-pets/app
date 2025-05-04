import NailTrimGame from '@/components/minigames/nail-trim-game'
import FoodGame from '@/components/minigames/food-game'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

interface Game{
    name: string
    component: React.JSX.Element
}

export default function MinigameScreen() {
    const games : Game[] = [
        { name: 'Nail Trim', component: <NailTrimGame /> },
        { name: 'Food Game', component: <FoodGame /> }, 
    ] 

    const [currentGame, setCurrentGame] = useState<Game | null>(null);

    const onOpenGame = (game : Game) => {
        setCurrentGame(game)
    }    
    return (
        <View style={styles.container}>
            {
                (currentGame !== null) ? currentGame.component : (
                    games.map((game, index) => (
                        <TouchableOpacity onPress={() => onOpenGame(game)} key={index}>
                            {game.name}                           
                        </TouchableOpacity>          
                    ))
                )
            }
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
})
