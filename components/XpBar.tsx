import { PawPrint } from 'phosphor-react-native'
import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Image, Platform } from 'react-native'

interface xpBarProps {
    xp: number
    level: number
}

const XpBar = ({ xp, level }: xpBarProps) => {
    const animatedValue = useRef(new Animated.Value(0)).current

    // Calculate the XP bar size based on the level
    const xpBarSize = 95 + level * 5

    const barWidth = animatedValue.interpolate({
        inputRange: [0, xpBarSize],
        outputRange: ['0%', '100%'],
    })

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: xp,
            duration: 500,
            useNativeDriver: false,
        }).start()
    }, [xp, animatedValue])

    return (
        <View style={styles.container}>
          <View style={styles.circleContainer}>
                          <View style={styles.pawContainer}>
                              <PawPrint size={60} color="#5b5b5b" />
                              <Text
                                  style={
                                      Platform.OS === 'ios'
                                          ? styles.levelTextIos
                                          : styles.levelTextAndroid
                                  }
                              >
                                  {level}
                              </Text>
                          </View>
                      </View>
            <View style={styles.bar}>
                <Text style={styles.text}>
                    {xp}/{xpBarSize}
                </Text>
                <View style={styles.barBackground}>
                    <Animated.View
                        style={[styles.barFill, { width: barWidth }]}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        marginHorizontal: 'auto',
    },

    circleContainer: {
      backgroundColor: 'transparent',
      borderRadius: 35,
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      position: 'relative',
  },
    pawContainer: {
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelTextIos: {
        position: 'absolute',
        top: '50%',
        left: '40%',
        fontFamily: 'Courier Mono',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#5b5b5b',
    },

    levelTextAndroid: {
        position: 'absolute',
        top: '65%',
        left: '50%',
        fontFamily: 'Courier Mono',
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        fontSize: 14,
        fontWeight: 'bold',
        color: '#5b5b5b',
    },

    text: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        alignSelf: 'flex-end',
        color: '#5B5B5B',
    },
    bar: {
        width: '81%',
    },
    barBackground: {
        width: '100%',
        height: 20,
        backgroundColor: '#ddd',
        borderRadius: 10,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: '#80BEE7',
    },
})

export default XpBar
