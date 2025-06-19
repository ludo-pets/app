import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { theme } from '@/constants/minigames/Pets2048'
import Board from '@/components/minigames/pets-2048/Board'
import Header from '@/components/Header'

export default function Pets2048() {
    const [resetKey, setResetKey] = useState(0)

    const handleNewGame = () => {
        setResetKey((prev) => prev + 1)
    }

    return (
        <View style={styles.container}>
            <Header
                title="2048 Pets"
                backgroundColor="#CFE2A8"
                showBackButton
            />
            <View style={styles.content}>
                <View style={styles.titleContainer}>
                    <Text style={styles.heading}>2048 Pets</Text>
                </View>

                <Text style={styles.tip}>
                    Combine os pets para ganhar mais pontos!
                </Text>

                <Board resetKey={resetKey} />

                <TouchableOpacity
                    style={styles.newGame}
                    onPress={handleNewGame}
                >
                    <Text style={styles.newGameText}>NOVO JOGO</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF8EF',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    titleContainer: {
        alignItems: 'center',
        backgroundColor: '#E8A598',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
        marginBottom: 12,
        elevation: 3,
    },
    heading: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: theme.fonts.regular,
    },
    score: {
        fontSize: 18,
        color: 'white',
        marginTop: 4,
        fontWeight: '600',
    },
    tip: {
        fontSize: 14,
        color: '#A67C7C',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    newGame: {
        marginTop: 24,
        marginBottom: 40,
        width: 160,
        backgroundColor: '#E8A598',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        elevation: 2,
    },
    newGameText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
})
