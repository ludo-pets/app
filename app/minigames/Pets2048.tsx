import { View, Text, StyleSheet, Button } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { theme } from '@/constants/minigames/Pets2048'
import Board from '@/components/minigames/pets-2048/Board'

export default function Pets2048() {
    const [resetKey, setResetKey] = useState(0)

    const handleNewGame = () => {
        setResetKey((prev) => prev + 1)
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleBackground}>
                <Text style={styles.heading}>2048 Pets</Text>
            </View>
            <Board resetKey={resetKey} />
            <View style={styles.newGame}>
                <Button
                    title="Novo Jogo"
                    onPress={handleNewGame}
                    color="#E8A598"
                />
            </View>
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF8EF',
        padding: 16,
        paddingTop: 48,
        justifyContent: 'space-between',
    },
    titleBackground: {
        backgroundColor: '#E8A598',
        width: 200,
        borderRadius: 10,
        alignItems: 'center',
    },
    heading: {
        fontSize: 40,
        fontWeight: '900',
        color: 'white',
        fontFamily: theme.fonts.regular,
    },
    newGame: {
        width: 100,
        marginBottom: 48,
        marginRight: 10,
        alignSelf: 'flex-end',
    },
})
