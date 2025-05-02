import { useUserPetStore } from '@/stores/userPetStore'
import { StyleSheet, View, Text, Button, Modal } from 'react-native'
import Header from '@/components/Header'
import { Quiz } from '@/components/Quiz'
import { navigate } from 'expo-router/build/global-state/routing'
import QuizCat from '@/assets/images/quiz-cat.svg'
import { useState } from 'react'
import QuizSummaryModal from '@/components/QuizSummaryModal'

const questions = [
    {
        question:
            'Quantas horas por dia gatos adultos costumam dormir em média?',
        options: [
            '4 a 6 horas',
            '6 a 8 horas',
            '8 a 10 horas',
            '10 a 12 horas',
        ],
        correctAnswer: '4 a 6 horas',
        imageSource: require('@/assets/images/quiz/quiz-cat.png'),
    },
    {
        question: 'Qual alimento é perigoso para cachorros?',
        options: ['Cenoura', 'Chocolate', 'Arroz', 'Frango'],
        correctAnswer: 'Chocolate',
        imageSource: require('@/assets/images/quiz/quiz-cat.png'),
    },
    {
        question: 'Qual é um sinal de que um pet está saudável?',
        options: [
            'Pelo brilhante',
            'Olhos lacrimejando',
            'Letargia',
            'Falta de apetite',
        ],
        correctAnswer: 'Pelo brilhante',
        imageSource: require('@/assets/images/quiz/quiz-cat.png'),
    },
    {
        question: 'Quantas vezes por ano deve-se levar um pet ao veterinário?',
        options: [
            'Apenas quando doente',
            '1 vez ao ano',
            '2 vezes por mês',
            'A cada 5 anos',
        ],
        correctAnswer: '1 vez ao ano',
        imageSource: require('@/assets/images/quiz/quiz-cat.png'),
    },
    {
        question: 'Qual é o benefício da castração em pets?',
        options: [
            'Evita fugas',
            'Evita doenças e crias indesejadas',
            'Deixa o pet mais agitado',
            'Não tem benefício',
        ],
        correctAnswer: 'Evita doenças e crias indesejadas',
        imageSource: require('@/assets/images/quiz/quiz-cat.png'),
    },
]

export default function QuizScreen() {
    const user = useUserPetStore((state) => state.user)
    const userUpdate = useUserPetStore((state) => state.updateUser)
    const petUpdate = useUserPetStore((state) => state.updatePet)
    const pet = useUserPetStore((state) => state.pet)

    const [currentIndex, setCurrentIndex] = useState(0)
    const [quizFinished, setQuizFinished] = useState(false)
    const [correctCount, setCorrectCount] = useState(0)

    const handleAnswer = (wasCorrect: boolean) => {
        if (wasCorrect) {
            setCorrectCount((prev) => prev + 1)
            if (user) {
                userUpdate(user?.id, {
                    money: user.money + 10,
                    experience: user.experience + 10,
                })
            }
            if (pet) {
                petUpdate(pet.id, { name: pet.name })
            }
        }
        // Espera x segundos para trocar a pergunta
        setTimeout(() => {
            if (currentIndex + 1 >= questions.length) {
                setQuizFinished(true)
            } else {
                setCurrentIndex((prev) => prev + 1)
            }
        }, 1000)
    }

    return (
        <>
            <View>
                <Header title="Quiz" backgroundColor="#CFE2A8" showBackButton></Header>
            </View>
            <View style={styles.container}>
                {!quizFinished && (
                    <Quiz
                        key={currentIndex} // Add this line to force re-rendering
                        question={questions[currentIndex].question}
                        options={questions[currentIndex].options}
                        correctAnswer={questions[currentIndex].correctAnswer}
                        imageSource={questions[currentIndex].imageSource}
                        onCorrectAnswer={() => handleAnswer(true)}
                        onWrongAnswer={() => handleAnswer(false)}
                    />
                )}

                <Modal visible={quizFinished} transparent animationType="fade">
                    <QuizSummaryModal
                        correctAnswers={correctCount}
                        total={questions.length}
                    />
                </Modal>
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
