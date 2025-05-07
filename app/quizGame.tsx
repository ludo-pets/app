import { useUserPetStore } from '@/stores/userPetStore'
import {
    StyleSheet,
    View,
    Text,
    Button,
    Modal,
    ActivityIndicator,
} from 'react-native'
import Header from '@/components/Header'
import { Quiz } from '@/components/Quiz'
import { navigate } from 'expo-router/build/global-state/routing'
import QuizCat from '@/assets/images/quiz-cat.svg'
import { useEffect, useState } from 'react'
import QuizSummaryModal from '@/components/QuizSummaryModal'
import { useQuestionsStore } from '@/stores/questionsStore'


export default function QuizScreen() {
    const user = useUserPetStore((state) => state.user)
    const userUpdate = useUserPetStore((state) => state.updateUser)
    const petUpdate = useUserPetStore((state) => state.updatePet)
    const pet = useUserPetStore((state) => state.pet)

    const { questions, loading, error, fetchQuestions } = useQuestionsStore()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [quizFinished, setQuizFinished] = useState(false)
    const [correctCount, setCorrectCount] = useState(0)

    useEffect(() => {
        fetchQuestions()
    }, [fetchQuestions])

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

    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" color="#6c63ff" />
                <Text>Carregando perguntas...</Text>
            </View>
        )
    }
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Erro: {error}</Text>
            </View>
        )
    }

    return (
        <>
            <View>
                <Header
                    title="Quiz"
                    backgroundColor="#CFE2A8"
                    showBackButton
                ></Header>
            </View>
            <View style={styles.container}>
                {!quizFinished && questions.length > 0 && (
                    <Quiz
                        key={currentIndex} // Add this line to force re-rendering
                        question={questions[currentIndex].id}
                        options={questions[currentIndex].answers}
                        correctAnswer={
                            questions[currentIndex].answers[
                                questions[currentIndex].rightAnswer
                            ]
                        }
                        imageSource={null} // Update if you have image handling
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
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
})
