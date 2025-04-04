import { usePetStore } from '@/stores/petStore'
import { useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default function HomeScreen() {
    const fetchPet = usePetStore((state) => state.fetchPet)
    const pet = usePetStore((state) => state.pet)

    useEffect(() => {
        const fetchData = async () => {
            const petId = '3FxLz0T8S3GcOvbyo3xH' // Substitua pelo ID do seu pet
            await fetchPet(petId)
        }
        fetchData()
    }, [fetchPet])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home</Text>
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
