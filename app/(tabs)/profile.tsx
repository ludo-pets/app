import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    useWindowDimensions,
} from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React, { useState } from 'react'


const editIcon = require('@/assets/images/profile/edit_icon.png')
const coinIcon = require('@/assets/images/profile/pet_coin.png')

export default function Profile() {
    const pet = require('@/assets/images/profile/cat_default.png')
    const [isChecked, setIsChecked] = useState(false)
    const { height: screenHeight } = useWindowDimensions()
    const styles = createStyles(screenHeight < 775)

    const toggleCheckbox = () => {
        setIsChecked(!isChecked)
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Perfil</Text>
            </View>

            <View style={styles.container}>
                <View style={styles.petContainer}>
                    <Image 
                        source={pet} 
                        style={styles.petImage}
                    />

                    <View style={styles.nameContainer}>
                        <Text style={styles.petName}>Simba</Text>
                        <Image
                            source={editIcon}
                            style={styles.editIcon}
                        />
                    </View>

                    <View style={styles.colorContainer}>
                        <View style={[styles.colorBox, { backgroundColor: '#D2B48C' }]} />
                        <View style={[styles.colorBox, { backgroundColor: '#A9A9A9' }]} />
                        <View style={[styles.colorBox, { backgroundColor: '#F5F5DC' }]} />
                        <View style={[styles.colorBox, { backgroundColor: '#FFFFE0' }]} />
                    </View>

                    <View style={styles.infoContainer}>
                        <View style={styles.coinsContainer}>
                            <Image 
                                source={coinIcon} 
                                style={styles.coinIcon}
                            />
                            <Text style={styles.coinsText}>100</Text>
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
                    <TouchableOpacity
                        style={styles.saveButton}
                    >
                        <Text style={styles.saveButtonText}>Salvar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutButton}
                    >
                        <Text style={styles.logoutButtonText}>Sair</Text>
                        <MaterialIcons
                            name="exit-to-app"
                            size={24}
                            color="#5B5B5B"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const createStyles = (isSmallScreen: boolean) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FEFEFE',
        height: '100%',
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
        alignSelf: 'center',
        justifyContent: 'space-between',
        paddingVertical: isSmallScreen ? 8 : 20,
        gap: isSmallScreen ? 20 : 20,
    },
    petContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 5
    },
    placeholderBox: {
        width: '100%',
        height: isSmallScreen ? 24 : 32,
        backgroundColor: '#94A3B8',
    },
    petImage: {
        width: isSmallScreen ? "60%" : 200,
        height: isSmallScreen ? "60%" : 200,
        resizeMode: 'contain',
    },
    nameContainer: {
        flexDirection: 'row',
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
        borderRadius: 6,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6.8,
        elevation: 4,
    },
    infoContainer: {
        width: '100%',
        justifyContent: 'flex-start',
        gap: isSmallScreen ? 15 : 20,
        paddingTop: isSmallScreen ? "5%" : 20,
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
        borderRadius: 6,
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
    },
    saveButton: {
        width: '100%',
        height: isSmallScreen ? 42 : 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B6E683',
        borderRadius: 24,
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
        borderRadius: 24,
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
