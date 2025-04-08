import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { CoinVertical } from 'phosphor-react-native'

interface CoinsProps {
    value?: number
}

export default function Coin({ value = 0 }: CoinsProps) {
    return (
        <View style={styles.container}>
            <CoinVertical size={32} weight="fill" color="#FFD700" />
            <Text style={styles.value}>{value}</Text>
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
        marginLeft: 8,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
})
