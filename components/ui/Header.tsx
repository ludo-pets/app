import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Coin from '../Coins'
import { ArrowCircleLeft } from 'phosphor-react-native'

interface HeaderProps {
    title: string
    backgroundColor?: string
    showBackButton?: boolean
    onBackPress?: () => void
    coinsValue?: number
}

export default function Header({
    title,
    backgroundColor = '#fff',
    showBackButton = false,
    onBackPress,
    coinsValue,
}: HeaderProps) {
    return (
        <View style={[styles.container, { backgroundColor }]}>
            {showBackButton && (
                <TouchableOpacity
                    onPress={onBackPress}
                    style={styles.backButton}
                >
                    <ArrowCircleLeft size={32} />
                </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
            {coinsValue !== undefined && (
                <View style={styles.coinsContainer}>
                    <Coin value={coinsValue} />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    backButton: {
        position: 'absolute',
        left: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    coinsContainer: {
        position: 'absolute',
        right: 16,
    },
})
