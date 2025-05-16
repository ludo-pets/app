import { useState } from 'react'
import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
    Dimensions,
} from 'react-native'

const petCoin = require('@/assets/images/profile/pet_coin.png')

export interface PetshopItemProps {
    id: string
    name: string
    price: number
    category: string
    has_required_level: boolean | null
    image: string
    quantity: number
    has_item: boolean
    is_active: boolean
}

const { width } = Dimensions.get('window')

export default function PetshopItem({ item }: { item: PetshopItemProps }) {
    const [active, setActive] = useState(item.is_active)

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={item.image ? { uri: item.image } : undefined}
                    style={styles.image}
                    resizeMode="contain"
                />
                {item.category === 'foods' && (
                    <View style={styles.quantityBadge}>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                    </View>
                )}
            </View>

            <View style={styles.details}>
                <View style={styles.rowTop}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={styles.price}>
                        <Image source={petCoin} style={styles.coin} />
                        <Text style={styles.priceText}>{item.price}</Text>
                    </View>
                </View>

                <View style={styles.rowButtons}>
                    {item.has_item && (
                        <Pressable
                            style={[
                                styles.button,
                                active ? styles.desactive : styles.active,
                            ]}
                            onPress={() => setActive(!active)}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    active && styles.buttonActiveText,
                                ]}
                            >
                                {active ? 'DESATIVAR' : 'ATIVAR'}
                            </Text>
                        </Pressable>
                    )}
                    <Pressable
                        style={[
                            styles.button,
                            item.has_required_level
                                ? styles.unlocked
                                : styles.locked,
                            styles.buyButton,
                        ]}
                        disabled={!item.has_required_level}
                    >
                        <Text style={styles.buttonText}>COMPRAR</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EDEDED',
        padding: 12,
        alignItems: 'center',
        marginVertical: 4,
        minHeight: 90,
        maxHeight: 90,
    },
    imageContainer: {
        width: width * 0.18,
        aspectRatio: 1,
        backgroundColor: '#CFE2A8',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    image: {
        width: '70%',
        height: '70%',
    },
    quantityBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#80BEE7',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    quantityText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    details: {
        flex: 1,
        height: '100%',
        justifyContent: 'space-between',
        marginLeft: 8,
    },
    rowTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    price: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coin: {
        width: width * 0.05,
        height: width * 0.05,
        marginRight: 4,
    },
    priceText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        minWidth: 80,
        alignItems: 'center',
    },
    buyButton: {
        marginLeft: 'auto',
    },
    buttonText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#FFF',
    },
    buttonActiveText: {
        color: '#5B5B5B',
    },
    active: {
        backgroundColor: '#D4E4EB',
    },
    desactive: {
        backgroundColor: '#EDB0B0',
    },
    unlocked: {
        backgroundColor: '#6DA92C',
    },
    locked: {
        backgroundColor: '#5B5B5B',
    },
})
