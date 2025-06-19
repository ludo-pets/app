import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Image,
    ActivityIndicator,
} from 'react-native'
import ItemPathQuiz from '@/components/quiz/ItemPathQuiz'
import { useUserPetStore } from '@/stores/userPetStore'
import { useRouter } from 'expo-router'
import { useLessonStore } from '@/stores/lessonStore'
import Lesson from '@/dtos/Lesson'
import { useAllLessonsStore } from '@/stores/allLessonsStore'

const paws = require('@/assets/images/paw.png')
const pawsTravled = require('@/assets/images/pawTraveled.png')

export default function QuizScreen() {
    const getAllLesssons = useAllLessonsStore(
        (state: { fetchAllLessons: any }) => state.fetchAllLessons
    )
    const lessons = useAllLessonsStore(
        (state: { lessons: any }) => state.lessons
    )
    const loading = useAllLessonsStore(
        (state: { loading: boolean }) => state.loading
    )
    const user = useUserPetStore((state) => state.user)
    const [lastLessonConcludedId, setLastLessonConcludedId] = useState(1)
    const { setLesson, changeToNextQuestion } = useLessonStore()
    const router = useRouter()

    const OnPressItem = (id: string) => {
        const lesson = lessons.find((lesson: Lesson) => lesson.id === id)
        if (!lesson) {
            alert('Lição não encontrada')
            return
        }

        if (lessons.indexOf(lesson) > lastLessonConcludedId) {
            alert('Você não pode acessar essa lição ainda')
            return
        }

        const currentLesson = lesson as Lesson

        if(lessons.indexOf(lesson) < lastLessonConcludedId) {

            
            setLesson(currentLesson)
            changeToNextQuestion('', currentLesson.questions)

            router.push('/quizSummary')
            return;
        }
        setLesson(currentLesson)
        changeToNextQuestion('', currentLesson.questions)

        router.push('/quizGame')
    }

    useEffect(() => {
        if (lessons && user?.lastLessonConcluded) {
            const lastIndex = lessons.findIndex(
                (item: Lesson) => item.id === user.lastLessonConcluded
            )
            if (lastIndex !== -1) {
                setLastLessonConcludedId(lastIndex + 1)
            }
        }
        if (!lessons) {
            getAllLesssons()
        }
    }, [getAllLesssons, user, lessons])

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1, width: '100%', height: '100%' }}>
                <ScrollView
                    style={{ flex: 1, width: '100%', height: '100%' }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    {loading ? (
                        <ActivityIndicator size="large" color="#5b5b5b" />
                    ) : (
                        lessons?.map((item: Lesson, index: number) => {
                            return (
                                <View key={item.id}>
                                    <ItemPathQuiz
                                        pendent={lastLessonConcludedId == index}
                                        onPress={() => OnPressItem(item.id)}
                                        id={item.id}
                                        name={item.name}
                                        index={index}
                                        icon={item.icon}
                                        concluded={
                                            lastLessonConcludedId > index
                                        }
                                    />
                                    {lessons.length - 1 !== index && (
                                        <View style={styles.boxPaws}>
                                            <Image
                                                source={
                                                    lastLessonConcludedId <=
                                                    index
                                                        ? paws
                                                        : pawsTravled
                                                }
                                            />
                                            <Image
                                                source={
                                                    lastLessonConcludedId <=
                                                    index
                                                        ? paws
                                                        : pawsTravled
                                                }
                                            />
                                        </View>
                                    )}
                                </View>
                            )
                        })
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#fefefe',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    boxPaws: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        marginTop: 5,
        marginBottom: 7,
    },
})
