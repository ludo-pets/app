import { useEffect } from 'react'
import {
    Button,
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
} from 'react-native'

const petCoin = require('@/assets/images/profile/pet_coin.png')

// export type itemsCategory =
//     | 'bed'
//     | 'Ração'
//     | 'toy'
//     | 'wc'
//     | 'floor'
//     | 'wallpaper'
export interface PetshopItemProps {
    id: string
    name: string
    price: number
    category: string
    has_required_level: boolean
    image: string
    quantity: number
    has_item: boolean
    is_active: boolean
}

const { width, height } = Dimensions.get('window')

export default function PetshopItem({ item }: { item: PetshopItemProps }) {
    useEffect(() => {
        console.log('item', item)
    }, [])
    const onActive = () => {}
    const onDesactive = () => {
        console.log(item.quantity)
    }
    const onBuy = () => {
        console.log('toBuy')
    }

    return (
        <view style={styles.item}>
            <view style={styles.imageBox}>
                <Image
                    style={styles.image}
                    resizeMode="contain"
                    source={item.image ? { uri: item.image } : undefined}
                />
                <Text style={styles.quantity}>{item.quantity}</Text>
            </view>
            <view style={styles.info}>
                <view style={styles.row1}>
                    <view>{item.name}</view>
                    <view style={styles.price}>
                        {' '}
                        <Image
                            style={{ width: width / 20, height: width / 20 }}
                            source={petCoin}
                        />
                        {item.price}
                    </view>
                </view>
                <view style={styles.row2}>
                    <Pressable
                        style={{
                            ...styles.button,
                            ...styles.active,
                            display:
                                item.has_item && !item.is_active
                                    ? 'flex'
                                    : 'none',
                        }}
                        onPress={() => onActive()}
                    >
                        <Text>ATIVAR</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => onDesactive()}
                        style={{
                            ...styles.desactive,
                            ...styles.button,
                            display:
                                item.has_item && item.is_active
                                    ? 'flex'
                                    : 'none',
                        }}
                    >
                        <Text>DESATIVAR</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => onBuy()}
                        disabled={item.has_item || !item.has_required_level}
                        style={{
                            ...styles.button,
                            display: !item.has_item ? 'flex' : 'none',
                            backgroundColor:
                                item.has_required_level && !item.has_item
                                    ? '#6DA92C'
                                    : '#5B5B5B',
                        }}
                    >
                        <Text style={styles.buttonText}>COMPRAR</Text>
                    </Pressable>
                </view>
            </view>
        </view>
    )
}

const styles = StyleSheet.create({
    item: {
        color: '#5B5B5B',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        fontFamily: 'inter',
        fontWeight: '500',
    },
    quantity: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        position: 'absolute',
        backgroundColor: '#80BEE7',
        minWidth: 30,
        minHeight: 30,
        padding: 3,
        bottom: 5,
        right: 5,
        textAlign: 'center',
        borderColor: 'white',
        borderWidth: 3,
        aspectRatio: '1/1',
        borderRadius: '50%',
    },
    imageBox: {
        position: 'relative',
        display: 'flex',
        margin: 0,
        height: '100%',
        aspectRatio: 1,
        backgroundColor: '#CFE2A8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: '70%',
        width: '100%',
        margin: 0,
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 30,
        padding: '5%',
        width: '60%',
    },
    row1: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
    },
    row2: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-end',
    },
    collum1: {
        display: 'flex',
        padding: 0,
        margin: 0,
        justifyContent: 'flex-start',
        width: '50%',
    },
    collum2: {
        display: 'flex',
        padding: 0,
        margin: 0,
        justifyContent: 'flex-end',
        width: '50%',
    },
    button: {
        color: 'white',
        borderRadius: 20,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 50,
        paddingRight: 50,
        width: '30%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    buttonText: {
        color: 'white',
    },
    active: {
        backgroundColor: '#D4E4EB',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
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
    price: {
        display: 'flex',
        gap: 5,
    },
})
