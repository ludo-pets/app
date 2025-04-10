import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    Pressable,
} from 'react-native'
import { router } from 'expo-router'
import { PawPrint } from 'phosphor-react-native'

const { width: screenWidth } = Dimensions.get('window')
const MoodBar = ({ animalLevel = 0, animalMood = 0 }) => {
    const [mood, setMood] = useState(animalMood)
    const [level] = useState(animalLevel)
    const animatedValue = useRef(new Animated.Value(0)).current
    const moodBarSize = 100

    const getBarColor = () => {
        if (mood <= 33) return '#ff0000'
        if (mood <= 66) return '#ffff00'
        return '#00ff00'
    }

    const barWidth = animatedValue.interpolate({
        inputRange: [0, moodBarSize],
        outputRange: ['0%', '100%'],
    })

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: mood,
            duration: 1000,
            useNativeDriver: false,
        }).start()
    }, [mood])

    return (
        <Pressable
            onPress={() => router.push('/profile')}
            style={styles.container}
        >
            <View style={styles.circleContainer}>
                <View style={styles.pawContainer}>
                    <PawPrint size={50} color="white" />
                    <Text style={styles.levelText}>{level}</Text>
                </View>
            </View>

            <View style={styles.bar}>
                <View style={styles.barBackground}>
                    <Animated.View
                        style={[
                            styles.barFill,
                            {
                                width: barWidth,
                                backgroundColor: getBarColor(),
                            },
                        ]}
                    />
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: screenWidth * 0.9,
        alignItems: 'center',
        marginHorizontal: 'auto',
        position: 'absolute',
        top: 40,
        zIndex: 99,
    },
    circleContainer: {
        backgroundColor: '#FF69B4',
        borderRadius: 30,
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        marginRight: -16,
    },
    pawContainer: {
        position: 'relative',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pawImage: {
        width: 40,
        height: 40,
        tintColor: 'white',
    },
    levelText: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -4 }, { translateY: -3.4 }],
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        alignSelf: 'flex-end',
        color: 'transparent',
    },
    bar: {
        width: '87%',
        marginTop: 20,
    },
    barBackground: {
        width: '100%',
        borderWidth: 2,
        borderColor: 'white',
        height: 24,
        backgroundColor: '#ddd',
        borderRadius: 12,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
    },
})

export default MoodBar
