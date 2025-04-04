import { usePetStore } from '@/stores/petStore'
import { useUserStore } from '@/stores/userStore'
import { StyleSheet, View, Text, Button } from 'react-native'

export default function QuizScreen() {
    const user = useUserStore((state) => state.user)
    const userUpdate = useUserStore((state) => state.updateUser)
    const pet = usePetStore((state) => state.pet)

    const handleEndQuiz = () => {
        console.log('Quiz finalizado')
        if (!user) return
        userUpdate(user?.id || '', {
          money: user?.money + 10,
          experience: user?.experience + 10,
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quiz</Text>
            <View style={styles.separator} />
            <Text style={styles.title}>{pet?.name}</Text>
            <Text style={styles.title}>{user?.money}</Text>
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
