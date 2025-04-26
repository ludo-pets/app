import { useUserPetStore } from '@/stores/userPetStore'
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
        // NAO DELETA (ASS: GABRIEL AGES 4)
        // petUpdate(pet?.id || '', {
        //     wellBeing: {
        //         clean: (new Date()).toString(),
        //         fun: (new Date()).toString(),
        //         hunger: (new Date('2025-03-25T21:00:00')).toString(),
        //         sleep: (new Date()).toString(),
        //         thirst: (new Date()).toString(),
        //     }
        // })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quiz</Text>
            <View style={styles.separator} />
            {/* 
            NAO DELETA (ASS: GABRIEL AGES 4)
            <Button onPress={() => handleEndQuiz()} >
                arruma
            </Button> */}
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
