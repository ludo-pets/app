import React from 'react'
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Image, Dimensions } from 'react-native'
import User from '@/dtos/User';
import ItemPathQuiz from '@/components/quiz/ItemPathQuiz';
import { useUserPetStore } from '@/stores/userPetStore'

const paws = require('@/assets/images/paw.png');
const pawsTravled = require('@/assets/images/pawTraveled.png');
interface pathItemQuiz {
    icon: string,
    name: string
    concluded: boolean,
    id: string
}

const user : User = {
    email: 'default@gmail.com',
    money: 10,
    level: 1,
    experience: 10,
    lastLessonConcluded: '1',
    notifications: true,
    pet: 'Simba',
    id: '1'
}

const catQuizzes: pathItemQuiz[] = [
    { icon: 'Medal', name: 'Primeiros cuidados com o gato', concluded: true, id: '0' },
    { icon: 'BowlFood', name: 'Nutrição e alimentação adequada', concluded: false, id: '1' },
    { icon: 'Toilet', name: 'Caixa de areia: uso e limpeza', concluded: false, id: '2' },
    { icon: 'HandHeart', name: 'Construindo confiança com seu gato', concluded: false, id: '3' },
    { icon: 'PuzzlePiece', name: 'Estimulação mental e brinquedos', concluded: false, id: '4' },
    { icon: 'Syringe', name: 'Vacinas e cuidados de saúde', concluded: false, id: '5' },
    { icon: 'Dresser', name: 'Organização do espaço do gato', concluded: false, id: '6' },
    { icon: 'ShieldCheck', name: 'Prevenindo acidentes em casa', concluded: false, id: '7' },
    { icon: 'Scissors', name: 'Cuidados com unhas e pelos', concluded: false, id: '8' },
    { icon: 'Heartbeat', name: 'Sinais de estresse e dor', concluded: false, id: '9' },
    { icon: 'Bird', name: 'Gatos e caça: instintos naturais', concluded: false, id: '10' },
    { icon: 'MoonStars', name: 'Gatos noturnos: como lidar?', concluded: false, id: '11' },
    { icon: 'HandsClapping', name: 'Gato e visitas: como apresentar?', concluded: false, id: '12' },
    { icon: 'Thermometer', name: 'Temperatura ideal e cuidados com o clima', concluded: false, id: '13' },
    { icon: 'MapPin', name: 'Como transportar o gato com segurança', concluded: false, id: '14' },
    { icon: 'Plant', name: 'Plantas perigosas para gatos', concluded: false, id: '15' },
    {
        icon: 'Trophy',
        name: 'Desafio final: cuidados com seu pet',
        concluded: false,
        id: 'final'
    }
  ];

export default function QuizScreen() {
    const userUpdate = useUserPetStore((state: { updateUser: any; }) => state.updateUser)
    const petUpdate = useUserPetStore((state: { updatePet: any; }) => state.updatePet)
    const pet = useUserPetStore((state: { pet: any; }) => state.pet)

    const OnPressItem = (id : string) => {
        //Move para tela do quiz
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1, width: '100%', height: '100%' }}>
                <ScrollView style={{ flex: 1, width: '100%', height: '100%' }} contentContainerStyle={{ paddingBottom: 20 }}>
                    {catQuizzes.map((item, index) => (
                        <> 
                            <ItemPathQuiz pendent={user.lastLessonConcluded == item.id} onPress={() => OnPressItem(item.id)} id={item.id} name={item.name} index={index} icon={item.icon} concluded={item.concluded} />
                            {catQuizzes.length - 1 !== index && (
                                <View style={styles.boxPaws}>
                                    <Image source={item.concluded === false ? paws : pawsTravled} />
                                    <Image source={item.concluded === false ? paws : pawsTravled} />
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
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    boxPaws :{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        marginTop: 5,
        marginBottom: 7,
    }
})
