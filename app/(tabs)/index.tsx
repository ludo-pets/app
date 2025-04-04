import { useUserPetStore } from '@/stores/ludoStore'
import { useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default function HomeScreen() {
    const fetchUserAndPet = useUserPetStore((state) => state.fetchUserAndPet)
    const user = useUserPetStore((state) => state.user)
    const pet = useUserPetStore((state) => state.pet)

    useEffect(() => {
        const userId = 'lKlrZ2s9n2fM7QGvZOuu'
        if (!user) {
            fetchUserAndPet(userId)
        }
    }, [fetchUserAndPet, user])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home</Text>
            <Text style={styles.title}>{pet?.name}</Text>
            <Text style={styles.title}>{user?.email}</Text>
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
