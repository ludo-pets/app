import { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { getAllItemService } from '@/services/itemService'
import { getUserWithPetByIdService } from '@/services/userService'
import Item from '@/dtos/Item'
import Pet from '@/dtos/Pet'
import PetshopItem from '@/components/PetshopItem'

type FilterTitle = {
    id: number
    name: string
    category: string
}

const filterTitles: FilterTitle[] = [
    { id: 1, name: 'Alimentação', category: 'Ração' },
    { id: 2, name: 'Brinquedos', category: 'toy' },
    { id: 3, name: 'Ambiente', category: 'floor' },
]

let itemsShop: Item[] = []
let petActiveItems: Pet['purchasedItems'] = []
let userLevel = 0
export default function StoreScreen() {
    const [selectedFilter, setSelectedFilter] = useState<FilterTitle>(
        filterTitles[0]
    )

    useEffect(() => {
        const fetchItems = async () => {
            const responseItemsShop = await getAllItemService()
            itemsShop = responseItemsShop?.items || []
            
            
            const responsePetActiveItems = await getUserWithPetByIdService(
                'ludopetsages@gmail.com'
            )
            petActiveItems = Array.isArray(
                responsePetActiveItems?.pet.activeItems
            )
                ? responsePetActiveItems?.pet.activeItems
                : []
            userLevel = responsePetActiveItems?.user.level || 0
            console.log('🚀 ~ fetchItems ~ userLevel:', userLevel)
            console.log('🚀 ~ fetchItems ~ petActiveItemsData:', petActiveItems)
            console.log('🚀 ~ useEffect ~ fetchItems:', itemsShop)
            console.log("item", itemsShop);
        }
        fetchItems()
    }, [itemsShop, petActiveItems, userLevel])

    return (
        <View style={styles.container}>
            <View style={styles.filter}>
                {filterTitles.map((title) => (
                    <Pressable
                        onPress={() => setSelectedFilter(title)}
                        key={title.id}
                        style={styles.titleBox}
                    >
                        <Text style={styles.title}>{title.name}</Text>
                        {title.id === selectedFilter.id && (
                            <View style={styles.notch} />
                        )}
                    </Pressable>
                ))}
            </View>

            {/* <View style={styles.itemsShopBox}>
                <FlatList
                    style={{ width: '100%' }}
                    data={itemsShop.filter(
                        (item) => item.category === selectedFilter.category
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <PetshopItem
                            item={{
                                id: item.id,
                                name: item.name,
                                category: item.category,
                                price: item.price,
                                type: item.type,
                                has_required_level:
                                    userLevel >= item.requiredLevel,
                                has_item: petActiveItems.some(
                                    (petItem) => petItem.id === item.id
                                ),
                                is_active: true,
                                quantity:
                                    petActiveItems.find(
                                        (petItem) => petItem.id === item.id
                                    )?.quantity || 0,
                            }}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 10 }} />
                    )}
                />
            </View> */}
           {itemsShop.map(item => (
             <PetshopItem item={{
                id: item.id,
                name: item.name,
                category: item.category,
                price: item.price,
                type: item.type,
                has_required_level:
                    userLevel >= item.requiredLevel,
                has_item: petActiveItems.some(
                    (petItem) => petItem.id === item.id
                ),
                is_active: true,
                quantity:
                    petActiveItems.find(
                        (petItem) => petItem.id === item.id
                    )?.quantity || 0,
            }}/>
           ))}
        </View>
    )
}

const styles = StyleSheet.create({
    filter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#cac4d0',
        padding: 10,
    },
    container: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        color: '#5B5B5B',
    },

    titleBox: {
        position: 'relative',
    },
    notch: {
        height: 3,
        width: '100%',
        backgroundColor: '#5B5B5B',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        transform: [{ translateY: 10 }],
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },

    itemsShopBox: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 10,
    },

    itemShop: {
        height: 92,
        backgroundColor: '#E5E5E5',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    itemShopText: {
        color: '#5B5B5B',
        fontWeight: 'bold',
        fontSize: 16,
    },
})
