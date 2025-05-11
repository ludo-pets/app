import { StyleSheet, View, Text, Modal, ActivityIndicator } from 'react-native'
import Header from '@/components/Header'
import { Quiz } from '@/components/Quiz'
import { useEffect, useState } from 'react'
import QuizSummaryModal from '@/components/QuizSummaryModal'
import { useLessonStore } from '@/stores/lessonStore'
import { router } from 'expo-router'
import { useUserPetStore } from '@/stores/userPetStore'
import { calcLevelUp } from '@/utils/CalcLevelUp'
import EndGameDialog from '@/components/minigames/food-game/EndGameDialog'

export default function QuizGame() {
    const [quizFinished, setQuizFinished] = useState(false)
    const [correctCount, setCorrectCount] = useState(0)

    const {
        loading,
        error,
        lesson,
        currentQuestion,
        changeToNextQuestion,
        finishLesson,
    } = useLessonStore()

    const { updateUser, user } = useUserPetStore()

    useEffect(() => {}, [currentQuestion])

    const handleCorrectAnswer = () => {
        setCorrectCount((prev) => prev + 1)
        handleChangeQuestion()
    }

    const handleChangeQuestion = () => {
        setTimeout(async () => {
            if (!currentQuestion || !lesson) {
                return
            }

            const hasNext = await changeToNextQuestion(
                currentQuestion.id,
                lesson.questions
            )
            if (!hasNext) {
                setQuizFinished(true)
                if (user) {
                    const { level, xp } = calcLevelUp(
                        user.experience,
                        user.level,
                        lesson.givenExperience
                    )

                    updateUser(user?.id, {
                        lastLessonConcluded: lesson.id,
                        level: level,
                        experience: xp,
                        money: user.money + lesson.givenMoney,
                    })
                }
                finishLesson(lesson)
            }
        }, 2000)
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
                        question={currentQuestion.description}
                        options={currentQuestion.answers}
                        correctAnswer={
                            currentQuestion.answers[currentQuestion.rightAnswer]
                        }
                        imageSource={
                            currentQuestion.image ||
                            require('@/assets/images/quiz/quiz-cat.png')
                        }
                        onCorrectAnswer={() => handleCorrectAnswer()}
                        onWrongAnswer={() => handleChangeQuestion()}
                    />
                )}
                {quizFinished && (
                    <EndGameDialog
                        callback={() => {
                            setQuizFinished(false)
                            router.push('/home')
                        }}
                        message="Você concluiu a lição!"
                        score={correctCount}
                        coins={lesson.givenMoney}
                    />
                )}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
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
