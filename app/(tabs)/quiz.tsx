import { useUserPetStore } from '@/stores/ludoStore'
import { StyleSheet, View, Text, Button } from 'react-native'

export default function QuizScreen() {
    const user = useUserPetStore((state) => state.user)
    const userUpdate = useUserPetStore((state) => state.updateUser)
    const petUpdate = useUserPetStore((state) => state.updatePet)
    const pet = useUserPetStore((state) => state.pet)

    const handleEndQuiz = () => {
        console.log('Quiz finalizado')
        if (!user) return
        userUpdate(user?.id || '', {
          money: user?.money + 10,
          experience: user?.experience + 10,
        })
        petUpdate(pet?.id || '', {
          name: 'Alaor',
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quiz</Text>
            <View style={styles.separator} />
            <Button title="Finalizar Quiz" onPress={handleEndQuiz} />
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
