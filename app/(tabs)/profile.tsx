import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ViewStyle,
    StyleSheet,
    SafeAreaView,
} from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useState } from 'react'

const editIcon = require('@/assets/images/profile/edit_icon.png')
const coinIcon = require('@/assets/images/profile/pet_coin.png')

export default function Profile() {
    const pet = require('@/assets/images/profile/cat_default.png')
    const [isChecked, setIsChecked] = useState(false)

    const buttonShadowStyle: ViewStyle = {
        shadowColor: 'blue',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    }

    const toggleCheckbox = () => {
        setIsChecked(!isChecked)
    }
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Perfil</Text>
                </View>

                <View style={styles.container}>
                    <View style={styles.petContainer}>
                        <View style={styles.placeholderBox}></View>

                        <Image source={pet} />

                        <View style={styles.nameContainer}>
                            <Text style={styles.petName}>Simba</Text>

                            <Image
                                source={editIcon}
                                style={{ width: 24, height: 24 }}
                            />
                        </View>

                        <View style={styles.colorContainer}>
                            <View
                                style={[
                                    styles.colorBox,
                                    { backgroundColor: '#D2B48C' },
                                ]}
                            ></View>
                            <View
                                style={[
                                    styles.colorBox,
                                    { backgroundColor: '#A9A9A9' },
                                ]}
                            ></View>
                            <View
                                style={[
                                    styles.colorBox,
                                    { backgroundColor: '#F5F5DC' },
                                ]}
                            ></View>
                            <View
                                style={[
                                    styles.colorBox,
                                    { backgroundColor: '#FFFFE0' },
                                ]}
                            ></View>
                        </View>

                        <View style={styles.infoContainer}>
                            <View style={styles.coinsContainer}>
                                <Image source={coinIcon}></Image>
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
                            style={[styles.saveButton, buttonShadowStyle]}
                        >
                            <Text style={styles.saveButtonText}>Salvar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.logoutButton, buttonShadowStyle]}
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
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 2,
        borderBottomColor: '#5B5B5B',
    },
    headerText: {
        fontWeight: '600',
        color: '#5B5B5B',
        fontSize: 36,
    },
    container: {
        width: '80%',
        flex: 1,
        alignSelf: 'center',
        paddingVertical: 20,
        justifyContent: 'space-between',
    },
    petContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
    },
    placeholderBox: {
        height: 40,
        width: '100%',
        backgroundColor: '#94A3B8',
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    petName: {
        fontWeight: '600',
        fontSize: 30,
        color: '#5B5B5B',
    },
    colorContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        height: 83,
        paddingTop: 16,
    },
    colorBox: {
        width: 40,
        height: 40,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    infoContainer: {
        width: '100%',
        justifyContent: 'flex-start',
        paddingTop: 32,
        gap: 16,
    },
    coinsContainer: {
        flexDirection: 'row',
        gap: 32,
    },
    coinsText: {
        fontWeight: '600',
        fontSize: 24,
        color: '#5B5B5B',
    },
    notificationContainer: {
        width: '100%',
        flexDirection: 'row',
        gap: 32,
        alignItems: 'center',
    },
    checkbox: {
        width: 35,
        height: 35,
        borderWidth: 3,
        borderRadius: 6,
        borderColor: '#5B5B5B',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    checkmark: {
        width: 26,
        height: 26,
        position: 'relative',
        left: 4,
        top: -2,
    },
    notificationText: {
        fontWeight: '600',
        fontSize: 24,
        color: '#5B5B5B',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 12,
        paddingTop: 20,
    },
    saveButton: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#B6E683',
        borderRadius: 24,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 24,
        textAlign: 'center',
        fontWeight: '600',
    },
    logoutButton: {
        flexDirection: 'row',
        gap: 12,
        borderWidth: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'transparent',
        borderRadius: 24,
    },
    logoutButtonText: {
        color: '#5B5B5B',
        fontSize: 24,
        textAlign: 'center',
        fontWeight: '600',
    },
})
