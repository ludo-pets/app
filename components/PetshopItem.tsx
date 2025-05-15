import Pet from '@/dtos/Pet'
import User from '@/dtos/User'
import { useUserPetStore } from '@/stores/userPetStore'
import { useEffect, useState } from 'react'
import {
    Button,
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
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
    type: string
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
    const user = useUserPetStore((state) => state.user);
    const pet = useUserPetStore((state) => state.pet);
    const userUpdate = useUserPetStore((state) => state.updateUser);
    const petUpdate = useUserPetStore((state) => state.updatePet)
    const fetchUserAndPet = useUserPetStore(state => state.fetchUserAndPet)
    const [hasItem, setHasItem] = useState(false)
    const [quantity, setQuantity] = useState<number>(item.quantity);
    const [canBuy, setCanBuy] = useState(false);
    const [isActive, setIsActive] = useState(item.is_active)

    useEffect(()=> {
        console.log("atualizou user e pet")

        let activeItems: {[Key: string]: string};
        if(pet) {
            activeItems = {...pet.activeItems};
            setIsActive(activeItems[item.type] == item.id)
            const thisItem = pet.purchasedItems.find(i => i.id == item.id)
            
            setHasItem(thisItem != null)
            setQuantity(thisItem?.quantity || 0);
        }
        if(user)
            
            setCanBuy(user?.money >= item.price)
            
    },[user, pet])

    const onActive = async () => {
       if(pet && user){
        const activeItems: {[Key: string]: string} = {...pet.activeItems};
        activeItems[item.type] = item.id;
        await petUpdate(pet.id, { activeItems: activeItems as any })
        await fetchUserAndPet(user.email);
       }
    }
    const onDesactive = () => {console.log(item.quantity);
    }
    const onBuy = async () => {

        
        if(user && pet){
            const newUser = {...user}
            const newPet  = {...pet}
            let curItem = null;
            newPet.purchasedItems
                .forEach(i => {
                    
                    if(i.id == item.id) {
                        
                        curItem = i;
                        i.quantity = i.quantity! + 1;
                    }
                });
            if(!curItem) {
                newPet.purchasedItems.push({...item, quantity: 1});
            }
             
         
            await userUpdate(newUser.id, { money: newUser.money - item.price });
            await petUpdate(newPet.id, {purchasedItems: newPet.purchasedItems});
            await fetchUserAndPet(user.email);
            
        
                
        }
    }

    const teste = Object.keys(categoryIcon).find(
        (category) => category == item.type
    )
    return (
        <View style={styles.item}>
            <View style={styles.imageBox}>
                <Image
                    style={styles.image}
                    resizeMode="contain"
                    source={
                        Object.keys(categoryIcon).find(
                            (category) => category == item.type
                        )
                            ? categoryIcon[
                                  item.type as keyof typeof categoryIcon
                              ]
                            : foodIcon
                    }
                />
                <Text style={styles.quantity}>
                    {quantity.valueOf()}
               
                </Text>
            </View>
            <View style={styles.info}>
                <View style={styles.row1}>
                    <View style={{width: "80%"}}>{item.name}</View>
                    <View style={styles.price}>
                        <Image
                            style={{ width: width / 20, height: width / 20 }}
                            source={petCoin}
                        />
                        {item.price}
                    </View>
                </View>
                <View style={styles.row2}>
                    
                        <Pressable
                            style={{
                                ...styles.button,
                                ...styles.active,
                                display:
                                    hasItem && !isActive
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
                                    hasItem && isActive
                                        ? 'flex'
                                        : 'none',
                            }}
                        >
                            <Text>DESATIVAR</Text>
                        </Pressable>
                    
                   
                        <Pressable
                            onPress={() => onBuy()}
                            disabled={!canBuy || !item.has_required_level}
                            style={{
                                ...styles.button,
                                
                                backgroundColor:
                                    item.has_required_level && canBuy
                                        ? '#6DA92C'
                                        : '#5B5B5B',
                            }}
                        >
                            <Text style={styles.buttonText}>COMPRAR</Text>
                        </Pressable>
                    
                </View>
            </View>
        </View>
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        position: "absolute",
        backgroundColor: "#80BEE7",
        minWidth: 30,
        minHeight: 30,
        padding: 3,
        bottom: 5,
        right: 5,
        textAlign: "center",
        borderColor: "white",
        borderWidth: 3,
        aspectRatio: "1/1",
        borderRadius:"50%"
    },
    imageBox: {
        position: "relative",
        display: 'flex',
        margin: 0,
        height: '100%',
        width: "40%",
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
