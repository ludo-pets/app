import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { CoinVertical } from 'phosphor-react-native'

interface CoinsProps {
    value?: number
    iconSize?: number
    textSize?: number
}

export default function Coin({
    value = 0,
    iconSize = 32,
    textSize = 24,
}: CoinsProps) {
    return (
        <View style={styles.container}>
            <CoinVertical size={iconSize} weight="fill" color="#FFD700" />
            <Text style={[styles.value, { fontSize: textSize }]}>{value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    value: {
        marginLeft: 4,
        fontWeight: '600',
        color: '#5B5B5B',
    },
})
