import Header from '@/components/ui/Header'
import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default function HomeScreen() {
    return (
        <>
            <View>
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>Home</Text>
                <View style={styles.separator} />
            </View>
        </>
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
