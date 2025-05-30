import React, { useCallback, useEffect, useState } from 'react'
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Dimensions,
    Image,
    TouchableHighlight,
    ActivityIndicator,
    ImageSourcePropType,
} from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import Minigame from '@/dtos/Minigame'
import { fetchMinigames } from '@/services/fetchMinigames'
import { router } from 'expo-router'

const { width } = Dimensions.get('window')
const imgRad = 16

interface MinigameListConfig {
    icon: ImageSourcePropType
    routeName: string
}

const minigameListRegistry: Record<string, MinigameListConfig> = {
    'Hora da Patinha': {
        icon: require('@/assets/images/minigames/minigame_icon_test.png'),
        routeName: 'NailTrimGame',
    },
    'Comilança Maluca': {
        icon: require('@/assets/images/minigames/food-game/gato_boca_aberta.png'),
        routeName: 'FoodGame',
    },
    'Flappy Pet': {
        icon: require('@/assets/images/minigames/flappyPet/flappyPetIcon.png'),
        routeName: 'FlappyPetGame',
    },
}

const getMinigameListConfig = (
    name: string
): MinigameListConfig | undefined => {
    return minigameListRegistry[name]
}

export default function MinigameScreen() {
    const navigation = useNavigation()
    const [minigames, setMinigames] = useState<Minigame[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const fetchedMinigames = await fetchMinigames()

                setMinigames(fetchedMinigames)
            } catch (err: any) {
                console.error('Failed to fetch minigames:', err)
                setError(
                    err.message || 'Failed to load minigames. Please try again.'
                )
                setMinigames([])
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    useFocusEffect(
        useCallback(() => {
            return () => {}
        }, [])
    )

    const handleNavigateToGame = useCallback(
        (gameName: string, gameId: string) => {
            const config = getMinigameListConfig(gameName)

            if (config && config.routeName) {
                setError(null)

                router.push({
                    pathname: `/minigames/${config.routeName}` as any,
                    params: {
                        minigameId: gameId,
                        minigameName: gameName,
                    },
                })
            } else {
                console.warn(
                    `Route configuration for game "${gameName}" not found.`
                )
                setError(`Game "${gameName}" cannot be opened right now.`)
            }
        },
        []
    )

    const renderMinigameItem = ({ item }: { item: Minigame }) => {
        const config = getMinigameListConfig(item.name)
        if (!config) {
            console.warn(
                `Skipping render for "${item.name}": No list/route configuration found.`
            )
            return null
        }

        return (
            <TouchableHighlight
                underlayColor="#ebebeb"
                onPress={() => handleNavigateToGame(item.name, item.id)}
            >
                <View style={styles.minigameBox}>
                    <View style={styles.imageContainer}>
                        <View style={styles.picBox}>
                            <Image
                                resizeMode="contain"
                                style={styles.listItemImage}
                                source={config.icon}
                            />
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.name}</Text>
                        <View style={styles.descContainer}>
                            <Text
                                style={styles.desc}
                                numberOfLines={3}
                                ellipsizeMode="tail"
                            >
                                {item.description}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#cfe2a8" />
                <Text style={styles.loadingText}>Loading Minigames...</Text>
            </View>
        )
    }

    if (error && !isLoading && minigames.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        )
    }

    console.log('🚀 ~ MinigameScreen ~ minigames:', minigames)
    return (
        <View style={styles.container}>
            <FlatList
                data={minigames}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMinigameItem}
                contentContainerStyle={
                    minigames.length === 0 ? styles.centered : null
                }
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text>No minigames available right now.</Text>
                    </View>
                }
            />
            {error && (
                <View style={styles.gameErrorOverlay}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableHighlight onPress={() => setError(null)}>
                        <Text style={styles.errorDismissText}>Dismiss</Text>
                    </TouchableHighlight>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fefefe',
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#cfe2a8',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 10,
    },
    gameErrorOverlay: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 100, 0, 0.85)',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    errorDismissText: {
        color: '#fff',
        marginTop: 5,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    desc: {
        fontSize: 14,
        fontWeight: '400',
        color: '#666',
        lineHeight: 18,
    },
    minigameBox: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#fff',
    },
    imageContainer: {
        flex: 0.25,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10,
    },
    picBox: {
        width: '100%',
        height: '100%',
        backgroundColor: '#E0F2FE',
        borderRadius: imgRad,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    listItemImage: {
        width: '100%',
        height: '100%',
        borderRadius: imgRad - 5 > 0 ? imgRad - 5 : imgRad,
    },
    textContainer: {
        flex: 0.75,
        justifyContent: 'center',
    },
    descContainer: {},
})
