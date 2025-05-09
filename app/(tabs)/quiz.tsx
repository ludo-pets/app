import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    SafeAreaView,
    Image,
    Dimensions,
} from 'react-native'
import User from '@/dtos/User'
import ItemPathQuiz from '@/components/quiz/ItemPathQuiz'
import { useUserPetStore } from '@/stores/userPetStore'
import { useRouter } from 'expo-router'
import { useLessonStore } from '@/stores/lessonStore'
import Lesson from '@/dtos/Lesson'

const paws = require('@/assets/images/paw.png')
const pawsTravled = require('@/assets/images/pawTraveled.png')
interface pathItemQuiz {
    icon: string
    name: string
    concluded: boolean
    id: string
    questions: string[]
}

const user: User = {
    email: 'default@gmail.com',
    money: 10,
    level: 1,
    experience: 10,
    lastLessonConcluded: '1',
    notifications: true,
    pet: 'Simba',
    id: '1',
}

const catQuizzes: pathItemQuiz[] = [
    {
        id: '4EipBNo2dYGUodZAPUKw',
        icon: 'Medal',
        name: 'Primeiros cuidados com o gato',
        concluded: true,
        questions: [
            'k1ROGvSlqzzJkKcjZ6Pr',
            'Bl281QXRbKXayrkba5SC',
            'zJr0hJDHC0ZtWCi2HtHf',
        ],
    },
    {
        id: '7DaxH8g8Sv6w7q51KiqS',
        icon: 'BowlFood',
        name: 'Nutrição e alimentação adequada',
        concluded: false,
        questions: ['NuX0FKfHBf0JcBhEl1iL', 'e7IWVN5TYFvu1PFMhsNl', 'iZfqK1am5wxEFrh5hKhZ'],
    },
    {
        id: '2',
        icon: 'Toilet',
        name: 'Caixa de areia: uso e limpeza',
        concluded: false,
        questions: ['1', '2', '3'],
    },
    {
        id: '3',
        icon: 'HandHeart',
        name: 'Construindo confiança com seu gato',
        concluded: false,
        questions: ['1', '2', '3'],
    },
    {
        id: '4',
        icon: 'PuzzlePiece',
        name: 'Estimulação mental e brinquedos',
        concluded: false,
        questions: ['1', '2', '3'],
    },
    {
        id: '5',
        icon: 'Syringe',
        name: 'Vacinas e cuidados de saúde',
        concluded: false,
        questions: ['1', '2', '3'],
    },
    {
        id: '6',
        icon: 'Dresser',
        name: 'Organização do espaço do gato',
        concluded: false,
        questions: ['1', '2', '3'],
    },
    {
        id: '7',
        icon: 'ShieldCheck',
        name: 'Prevenindo acidentes em casa',
        concluded: false,
        questions: ['1', '2', '3'],
    },
    {
        id: '8',
        icon: 'Scissors',
        name: 'Cuidados com unhas e pelos',
        concluded: false,
        questions: ['1', '2', '3'],
    },
    {
        id: '9',
        icon: 'Heartbeat',
        name: 'Sinais de estresse e dor',
        concluded: false,
        questions: ['1', '2', '3'],
    },
    {
        id: '10',
        icon: 'Bird',
        name: 'Gatos e caça: instintos naturais',
        concluded: false,
        questions: ['1', '2', '3'],
    },
    {
        id: '11',
        icon: 'MoonStars',
        name: 'Gatos noturnos: como lidar?',
        concluded: false,
        questions: ['1', '2', '3'],
    },
    {
        id: '12',
        icon: 'HandsClapping',
        name: 'Gato e visitas: como apresentar?',
        concluded: false,
        questions: ['1', '2', '3'],
    },
    {
        id: '13',
        icon: 'Thermometer',
        name: 'Temperatura ideal e cuidados com o clima',
        concluded: false,
        questions: ['1', '2', '3'],
    },
    {
        id: '14',
        icon: 'MapPin',
        name: 'Como transportar o gato com segurança',
        concluded: false,
        questions: ['1', '2', '3'],
    },
    {
        id: '15',
        icon: 'Plant',
        name: 'Plantas perigosas para gatos',
        concluded: false,
        questions: ['1', '2', '3'],
    },
    {
        id: 'final',
        icon: 'Trophy',
        name: 'Desafio final: cuidados com seu pet',
        concluded: false,
        questions: [],
    },
]

export default function QuizScreen() {
    const userUpdate = useUserPetStore(
        (state: { updateUser: any }) => state.updateUser
    )
    const petUpdate = useUserPetStore(
        (state: { updatePet: any }) => state.updatePet
    )
    const pet = useUserPetStore((state: { pet: any }) => state.pet)

    const { setLesson, changeToNextQuestion } = useLessonStore()

    const router = useRouter()

    const OnPressItem = (id: string) => {
        router.push('/quizGame')
        const lesson = catQuizzes.find((quiz) => quiz.id === id)
        if (!lesson) {
            throw new Error('PUTZ')
        }
        const currentLesson = lesson as Lesson
        setLesson(currentLesson)
        changeToNextQuestion('', currentLesson.questions)
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1, width: '100%', height: '100%' }}>
                <ScrollView
                    style={{ flex: 1, width: '100%', height: '100%' }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    {catQuizzes.map((item, index) => (
                        <>
                            <ItemPathQuiz
                                pendent={user.lastLessonConcluded == item.id}
                                onPress={() => OnPressItem(item.id)}
                                id={item.id}
                                name={item.name}
                                index={index}
                                icon={item.icon}
                                concluded={item.concluded}
                            />
                            {catQuizzes.length - 1 !== index && (
                                <View style={styles.boxPaws}>
                                    <Image
                                        source={
                                            item.concluded === false
                                                ? paws
                                                : pawsTravled
                                        }
                                    />
                                    <Image
                                        source={
                                            item.concluded === false
                                                ? paws
                                                : pawsTravled
                                        }
                                    />
                                </View>
                            )}
                        </>
                    ))}
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
