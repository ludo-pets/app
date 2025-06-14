import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    useWindowDimensions,
    TextInput,
    Pressable,
    ScrollView,
} from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useEffect, useState } from 'react'
import React from 'react'
import XpBar from '@/components/XpBar'
import { colorsOptions, PetOption } from '@/components/FormRegisterPet'

import Gato from '@/assets/images/pets/gato/gato.svg'
import Cachorro from '@/assets/images/pets/cachorro/cachorro.svg'
import { PetOptionFormRegisterPet } from '@/components/PetOptionFormRegisterPet'
import { useUserPetStore } from '@/stores/userPetStore'
import { useRouter } from 'expo-router'
import AchievementType from '@/dtos/Achievement'
import { fetchAchievements } from '@/services/fetchAchievements'
import Achievement from '@/components/Achievement'

const editIcon = require('@/assets/images/profile/edit_icon.png')
const coinIcon = require('@/assets/images/profile/pet_coin.png')

export default function Profile() {
    const [isChecked, setIsChecked] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const { height: screenHeight } = useWindowDimensions()
    const styles = createStyles(screenHeight < 775)
    const user = useUserPetStore((state) => state.user)
    const petUpdate = useUserPetStore((state) => state.updatePet)
    const petInfo = useUserPetStore((state) => state.pet)
    const [petName, setPetName] = useState(petInfo?.name || '')
    const [petColor, setPetColor] = useState(petInfo?.color || '')
    const [achievements, setAchievements] = useState<AchievementType[]>([])
    const router = useRouter()

    useEffect(() => {
        const loadData = async () => {
            try {
                const achievements = await fetchAchievements()
                setAchievements(achievements)
            } catch (err: any) {
                console.error('Failed to fetch achievements:', err)
                setAchievements([])
            }
        }

        loadData()

        if (petInfo) {
            setPetName(petInfo.name)
            setPetColor(petInfo.color)
        }
    }, [petInfo])

    const handlerChangePetName = (text: string) => {
        setPetName(text)
    }

    const colors = colorsOptions

    const pets: PetOption[] = [
        {
            icon: petInfo?.type === 'cat' ? Gato : Cachorro,
            pet_type: petInfo?.type || 'cat',
        },
    ]

    const toggleCheckbox = () => {
        setIsChecked(!isChecked)
    }

    const updatePet = async () => {
        if (petInfo) {
            if (petInfo.name === petName && petInfo.color === petColor) {
                setIsEditing(false)
                return
            }
            await petUpdate(petInfo.id, {
                name: petName,
                color: petColor,
            })
        } else {
            console.error('Pet ID is undefined')
        }
        setIsEditing(false)
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.container}>
                    <XpBar
                        xp={user?.experience || 0}
                        level={user?.level || 1}
                    />
                    <View style={styles.petContainer}>
                        <PetOptionFormRegisterPet
                            Icon={pets[0].icon}
                            onSelect={() => {}}
                            selected={false}
                            onlyPet={false}
                            color={petColor || '#7D5D56'}
                        />
                        <View style={styles.nameContainer}>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.inputBox]}
                                    onChangeText={handlerChangePetName}
                                    value={petName}
                                />
                            ) : (
                                <>
                                    <Text style={styles.petName}>
                                        {petInfo?.name}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setIsEditing(!isEditing)}
                                    >
                                        <Image
                                            source={editIcon}
                                            style={styles.editIcon}
                                        />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                        <View style={styles.colorOptionBox}>
                            {colors.map((color) => {
                                const colorSelected = color.color === petColor
                                return (
                                    <Pressable
                                        key={color.id}
                                        style={[
                                            { backgroundColor: color.color },
                                            styles.colorOption,
                                            colorSelected &&
                                                styles.colorOptionActive,
                                        ]}
                                        onPress={() => {
                                            if (!isEditing) {
                                                return
                                            }
                                            setPetColor(color.color)
                                        }}
                                    />
                                )
                            })}
                        </View>
                        <View style={styles.infoContainer}>
                            <View style={styles.coinsContainer}>
                                <Image
                                    source={coinIcon}
                                    style={styles.coinIcon}
                                />
                                <Text style={styles.coinsText}>
                                    {user?.money}
                                </Text>
                            </View>

                            <View style={styles.notificationContainer}>
                                <TouchableOpacity
                                    style={styles.checkbox}
                                    onPress={toggleCheckbox}
                                >
                                    {isChecked && (
                                        <Image
                                            source={require('@/assets/images/profile/check.png')}
                                            style={styles.checkmark}
                                        />
                                    )}
                                </TouchableOpacity>
                                <Text style={styles.notificationText}>
                                    Notificações
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        {isEditing && (
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={() => updatePet()}
                            >
                                <Text style={styles.saveButtonText}>
                                    Salvar
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {!isEditing && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {achievements.map((achievement) => (
                                <View key={achievement.id}>
                                    <Achievement
                                        title={achievement.name}
                                        description={achievement.message}
                                        conquered={false}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const createStyles = (isSmallScreen: boolean) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: '#FEFEFE',
            height: '100%',
        },
        colorOptionBox: {
            flexDirection: 'row',
            flexWrap: 'wrap', // Allow wrapping if many colors
            justifyContent: 'center', // Center colors
            gap: 15, // Increased gap
        },
        colorOption: {
            width: 32,
            height: 32,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84, // Adjusted shadow
            borderRadius: 5, // Make it circular
            elevation: 5, // Add elevation for Android
        },
        colorOptionActive: {
            borderWidth: 3,
            borderColor: '#80BEE7',
            borderStyle: 'solid',
        },
        imageContainer: {
            width: '90%',
            aspectRatio: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputBox: {
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 8,
            height: 40,
            borderWidth: 1,
            borderColor: '#D9D0E3',
            borderRadius: 8,
            borderStyle: 'solid',
            backgroundColor: '#FFF',
        },
        header: {
            width: '100%',
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: '#5B5B5B',
        },
        headerText: {
            fontSize: 32,
            fontWeight: '600',
            color: '#5B5B5B',
        },
        container: {
            flex: 1,
            width: '85%',
            height: '100%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            paddingVertical: isSmallScreen ? 12 : 20,
            gap: isSmallScreen ? 12 : 20,
        },
        petContainer: {
            width: '100%',
            alignItems: 'center',
            gap: 5,
        },
        placeholderBox: {
            width: '100%',
            height: isSmallScreen ? 24 : 32,
            backgroundColor: '#94A3B8',
        },
        petImage: {
            width: isSmallScreen ? '60%' : 200,
            height: isSmallScreen ? '60%' : 200,
            resizeMode: 'contain',
        },
        nameContainer: {
            flexDirection: 'row',
            width: '80%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 10,
            alignItems: 'center',
            gap: 12,
        },
        petName: {
            fontSize: isSmallScreen ? 24 : 30,
            fontWeight: '600',
            color: '#5B5B5B',
        },
        editIcon: {
            width: isSmallScreen ? 20 : 24,
            height: isSmallScreen ? 20 : 24,
            resizeMode: 'contain',
        },
        colorContainer: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
            paddingTop: isSmallScreen ? 12 : 16,
        },
        colorBox: {
            width: isSmallScreen ? 32 : 40,
            height: isSmallScreen ? 32 : 40,
            borderRadius: 8,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 6.8,
            elevation: 4,
        },
        colorBoxActive: {
            width: isSmallScreen ? 32 : 40,
            height: isSmallScreen ? 32 : 40,
            borderRadius: 8,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 6.8,
            elevation: 4,
            borderWidth: 3,
            borderColor: '#80BEE7',
            borderStyle: 'solid',
        },
        infoContainer: {
            width: '100%',
            justifyContent: 'flex-start',
            gap: isSmallScreen ? 15 : 20,
            paddingTop: isSmallScreen ? '5%' : 20,
        },
        coinsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: isSmallScreen ? 16 : 24,
        },
        coinIcon: {
            width: isSmallScreen ? 30 : 35,
            height: isSmallScreen ? 30 : 35,
            resizeMode: 'contain',
        },
        coinsText: {
            fontSize: isSmallScreen ? 22 : 24,
            fontWeight: '600',
            color: '#5B5B5B',
        },
        notificationContainer: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            gap: isSmallScreen ? 16 : 24,
        },
        checkbox: {
            width: isSmallScreen ? 30 : 35,
            height: isSmallScreen ? 30 : 35,
            borderWidth: 3,
            borderRadius: 8,
            borderColor: '#5B5B5B',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        checkmark: {
            width: isSmallScreen ? 20 : 24,
            height: isSmallScreen ? 20 : 24,
            position: 'relative',
            left: 2,
            top: 0,
        },
        notificationText: {
            fontSize: isSmallScreen ? 22 : 24,
            fontWeight: '600',
            color: '#5B5B5B',
        },
        buttonContainer: {
            width: '100%',
            alignItems: 'center',
            gap: isSmallScreen ? 12 : 12,
            paddingTop: 0,
            marginTop: 'auto',
        },
        saveButton: {
            width: '100%',
            height: isSmallScreen ? 42 : 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#B6E683',
            borderRadius: 20,
            shadowColor: 'blue',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 3.5,
            elevation: 5,
        },
        saveButtonText: {
            fontSize: isSmallScreen ? 22 : 24,
            color: 'white',
            textAlign: 'center',
            fontWeight: '600',
        },
        logoutButton: {
            flexDirection: 'row',
            gap: 12,
            width: '100%',
            height: isSmallScreen ? 42 : 50,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderRadius: 20,
            shadowColor: '#80BEE7',
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 8,
            elevation: 8,
        },
        logoutButtonText: {
            fontSize: isSmallScreen ? 22 : 24,
            color: '#5B5B5B',
            textAlign: 'center',
            fontWeight: '600',
        },
    })
