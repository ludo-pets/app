import { useUserPetStore } from '@/stores/userPetStore'
import { StyleSheet, View, Text, Button } from 'react-native'
import Header from '@/components/Header'
import { Quiz } from '@/components/Quiz'
import { navigate } from 'expo-router/build/global-state/routing'
import QuizCat from '@/assets/images/quiz-cat.svg'

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
        <View className="flex-1 bg-white">
        <Quiz
          question="Quantas horas por dia gatos adultos costumam dormir em média?"
          options={['4 a 6 horas', '6 a 8 horas', '8 a 10 horas', '10 a 12 horas']}
          correctAnswer="4 a 6 horas"
          imageSource={require('@/assets/images/quiz/quiz-cat.png')}
          onCorrectAnswer={handleEndQuiz}
        />
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
