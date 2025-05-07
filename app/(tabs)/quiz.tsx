import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

export default function Quiz() {
    const router = useRouter()

    const handleStartQuiz = () => {
        //TODO: Navigate to the quizGame screen
        router.push('/quizGame')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select a Lesson</Text>
            <TouchableOpacity style={styles.button} onPress={handleStartQuiz}>
                <Text style={styles.buttonText}>Start Quiz</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#6c63ff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
})
