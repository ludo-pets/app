import { useEffect, useState } from 'react'
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
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

    const onActive = () => setActive(true)
    const onDesactive = () => setActive(false)
    const onBuy = () => {
        /* implementar compra */
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageBox}>
                <Image
                    style={styles.image}
                    resizeMode="contain"
                    source={item.image ? { uri: item.image } : undefined}
                />
                {item.category === 'foods' && (
                    <View style={styles.quantityBadge}>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                    </View>
                )}
            </View>

            <View style={styles.info}>
                {/* Linha de nome + preço */}
                <View style={styles.row1}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={styles.price}>
                        <Image
                            source={petCoin}
                            style={{ width: width / 20, height: width / 20 }}
                        />
                        <Text style={styles.priceText}>{item.price}</Text>
                    </View>
                </View>

                {/* Linha de botões */}
                <View style={styles.row2}>
                    {item.has_item && (
                        <Pressable
                            style={[
                                styles.button,
                                active ? styles.desactive : styles.active,
                            ]}
                            onPress={active ? onDesactive : onActive}
                        >
                            <Text style={styles.buttonActive}>
                                {active ? 'DESATIVAR' : 'ATIVAR'}
                            </Text>
                        </Pressable>
                    )}

                    <Pressable
                        onPress={onBuy}
                        disabled={!item.has_required_level}
                        style={[
                            styles.button,
                            item.has_required_level ? styles.unlocked : styles.locked,
                            { marginLeft: 'auto' },
                        ]}
                    >
                        <Text style={styles.buttonText}>COMPRAR</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        width: '100%',
    },
    imageBox: {
        width: width * 0.18,
        aspectRatio: 1,
        backgroundColor: '#CFE2A8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        position: 'relative',
    },
    image: {
        width: '80%',
        height: '80%',
    },
    quantityBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#80BEE7',
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        color: 'white',
        fontWeight: 'bold',
    },
    info: {
        flex: 1,
        justifyContent: 'space-between',
    },
    row1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        color: '#5B5B5B',
    },
    price: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceText: {
        marginLeft: 6,
        fontSize: 16,
        color: '#5B5B5B',
    },
    row2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    buttonActive: {
        color: '#5B5B5B',
        fontSize: 14,
        fontWeight: '500',
    },
    active: {
        backgroundColor: '#D4E4EB',
    },
    desactive: {
        backgroundColor: '#EDB0B0',
        marginRight: 10,
    },
    unlocked: {
        backgroundColor: '#6DA92C',
    },
    locked: {
        backgroundColor: '#5B5B5B',
    },
})
