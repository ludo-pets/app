import { usePetStore } from '@/stores/petStore'
import { StyleSheet, View, Text } from 'react-native'

export default function TabOneScreen() {
    const pet = usePetStore((state) => state.pet)
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.title}>{pet?.name}</Text>
            <View style={styles.separator} />
        </View>
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
