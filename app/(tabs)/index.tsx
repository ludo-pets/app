import { usePetStore } from '@/stores/petStore'
import { useUserStore } from '@/stores/userStore'
import { useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default function HomeScreen() {
    const fetchPet = usePetStore((state) => state.fetchPet)
    const pet = usePetStore((state) => state.pet)
    const fetchUser = useUserStore((state) => state.fetchUser)
    const user = useUserStore((state) => state.user)

    useEffect(() => {
        const fetchPets = async () => {
            const petId = '3FxLz0T8S3GcOvbyo3xH'
            await fetchPet(petId)
        }
        const fetchUsers = async () => {
          const userId = 'lKlrZ2s9n2fM7QGvZOuu'
          await fetchUser(userId)
      }
        if (!pet) {
            fetchPets()
        }
        if (!user) {
            fetchUsers()
        }
    }, [fetchPet, fetchUser, pet])

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
