import React, { useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native'

interface QuizProps {
    question: string
    options: string[]
    correctAnswer: string
    imageSource?: any
    onCorrectAnswer: () => void
    onWrongAnswer: () => void
}

export function Quiz({
    question,
    options,
    correctAnswer,
    imageSource,
    onCorrectAnswer,
    onWrongAnswer,
}: QuizProps) {
    const [selected, setSelected] = useState<string | null>(null)

    const handlePress = (option: string) => {
        if (selected) return
        setSelected(option)
        if (option === correctAnswer) {
            onCorrectAnswer()
        } else {
            onWrongAnswer() 
        }
    }

    const getOptionStyle = (option: string) => {
        if (!selected) return styles.option
        if (option === correctAnswer) return [styles.option, styles.correct]
        if (option === selected) return [styles.option, styles.incorrect]
        return styles.option
    }

    return (
        <View style={styles.container}>
            <Image source={imageSource} />
            <Text style={styles.question}>{question}</Text>
            <View style={styles.optionsContainer}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={getOptionStyle(option)}
                        onPress={() => handlePress(option)}
                        disabled={!!selected}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
        backgroundColor: '#fefefe',
        alignItems: 'center',
        width: '100%',
    },
    image: {
        width: 120,
        height: 120,
        marginBottom: 16,
        borderColor: '#55fe00',
    },
    question: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: '#444',
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 16,
    },
    option: {
        width: '48%',
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    correct: {
        backgroundColor: '#d6e6af',
    },
    incorrect: {
        backgroundColor: '#f4b7b7',
    },
    optionText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
    },
})
