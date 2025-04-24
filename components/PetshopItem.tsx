import {
    Button,
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
} from 'react-native'

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
    quantity: number
    has_item: boolean
    is_active: boolean
}

const { width, height } = Dimensions.get('window')

//imagens baixadas de https://www.freepik.com/
const foodIcon = require('@/assets/images/petshop/pet-food.png')
const bedIcon = require('@/assets/images/petshop/pet-bed.png')
const toyIcon = require('@/assets/images/petshop/wool.png')
const wcIcon = require('@/assets/images/petshop/litter-box.png')
const customisationIcon = require('@/assets/images/petshop/painting.png')
const petCoin = require('@/assets/images/profile/pet_coin.png')

const categoryIcon = {
    bed: bedIcon,
    food: foodIcon,
    toy: toyIcon,
    wc: wcIcon,
    floor: customisationIcon,
    wallpaper: customisationIcon,
}
export default function PetshopItem({ item }: { item: PetshopItemProps }) {
    const onActive = () => {}
    const onDesactive = () => {}
    const onBuy = () => {
        console.log('toBuy')
    }
    const teste = Object.keys(categoryIcon).find(
        (category) => category == item.category
    )
    return (
        <view style={styles.item}>
            <view style={styles.imageBox}>
                <Image
                    style={styles.image}
                    resizeMode="contain"
                    source={
                        Object.keys(categoryIcon).find(
                            (category) => category == item.category
                        )
                            ? categoryIcon[
                                  item.category as keyof typeof categoryIcon
                              ]
                            : foodIcon
                    }
                />
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
                    <view style={styles.collum1}>
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
                    </view>
                    <view style={styles.collum2}>
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
    imageBox: {
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
        justifyContent: 'space-between',
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
