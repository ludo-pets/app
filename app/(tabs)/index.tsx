import { useUserPetStore } from '@/stores/ludoStore'
import { useEffect } from 'react'
import Header from '@/components/ui/Header'
import { StyleSheet, View, Text } from 'react-native'

export default function HomeScreen() {
    const fetchUserAndPet = useUserPetStore((state) => state.fetchUserAndPet)
    const user = useUserPetStore((state) => state.user)
    const pet = useUserPetStore((state) => state.pet)

    useEffect(() => {
        const userId = 'ludopetsages@gmail.com'
        if (!user) {
            fetchUserAndPet(userId)
        }
    }, [fetchUserAndPet, user])

    return (
        <>
            <View>
                <Header
                    title="Minigame"
                    showBackButton={true}
                    onBackPress={() => console.log('Go Back')}
                    coinsValue={100}
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>Home</Text>
                <View style={styles.separator} />
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
