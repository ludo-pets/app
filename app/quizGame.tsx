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
import { useLessonStore } from '@/stores/lessonStore'
import { router } from 'expo-router'


export default function QuizGame() {
    const user = useUserPetStore((state) => state.user)
    const userUpdate = useUserPetStore((state) => state.updateUser)
    const petUpdate = useUserPetStore((state) => state.updatePet)
    const pet = useUserPetStore((state) => state.pet)

    const [quizFinished, setQuizFinished] = useState(false)
    const [correctCount, setCorrectCount] = useState(0)

    const { loading, error, lesson, currentQuestion, changeToNextQuestion, finishLesson } = useLessonStore()

    useEffect(() => { }, [currentQuestion])

    const handleCorrectAnswer = () => {
        setCorrectCount((prev) => prev + 1)    
        if (pet) {
            petUpdate(pet.id, { name: pet.name })
        }
        handleChangeQuestion()
    }

    const handleChangeQuestion = async () => {
        if (!currentQuestion || !lesson) {
            return
        }

        const hasNext = await changeToNextQuestion(currentQuestion.id, lesson.questions)
        if (!hasNext) {
            setQuizFinished(true)
            finishLesson(lesson)
        }
    }

    if (loading || !lesson) {
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
                {currentQuestion && (
                    <Quiz
                        key={currentQuestion.id} 
                        question={currentQuestion.title}
                        options={currentQuestion.answers}
                        correctAnswer={
                            currentQuestion.answers[
                                currentQuestion.rightAnswer
                            ]
                        }
                        imageSource={null} 
                        onCorrectAnswer={() => handleCorrectAnswer()}
                        onWrongAnswer={() => handleChangeQuestion()}
                    />
                )}

                <Modal visible={quizFinished} transparent animationType="fade">
                    <QuizSummaryModal
                        correctAnswers={correctCount}
                        total={lesson.questions.length}
                        onClose={() => {
                            setQuizFinished(false)
                            router.push('/home')

                        }}
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
