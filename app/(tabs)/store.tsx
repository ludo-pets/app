import { useEffect, useState, useCallback } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    ActivityIndicator,
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { getAllItemService } from '@/services/itemService'
import { getUserWithPetByIdService } from '@/services/userService'
import Item from '@/dtos/Item'
import Pet from '@/dtos/Pet'
import PetshopItem from '@/components/PetshopItem'

type FilterTitle = {
    id: number
    name: string
    category: 'foods' | 'toys' | 'environment'
}

const filterTitles: FilterTitle[] = [
    { id: 1, name: 'Alimentação', category: 'foods' },
    { id: 2, name: 'Brinquedos', category: 'toys' },
    { id: 3, name: 'Ambiente', category: 'environment' },
]

export default function StoreScreen() {
    const [selectedFilter, setSelectedFilter] = useState<FilterTitle>(
        filterTitles[0]
    )
    const [isLoading, setIsLoading] = useState(true)

    const [itemsShop, setItemsShop] = useState<Item[]>([])
    const [petActiveItems, setPetActiveItems] = useState<Pet['purchasedItems']>(
        []
    )
    const [petPurchasedItems, setPetPurchasedItems] = useState<
        Pet['purchasedItems']
    >([])
    const [userLevel, setUserLevel] = useState<number>(0)

    useEffect(() => {
        const fetchItems = async () => {
            const responseItemsShop = await getAllItemService()
            setItemsShop(responseItemsShop?.items || [])

            const responsePetData = await getUserWithPetByIdService(
                'ludopetsages@gmail.com'
            )

            setPetActiveItems(
                Array.isArray(responsePetData?.pet.activeItems)
                    ? responsePetData.pet.activeItems
                    : []
            )

            setPetPurchasedItems(
                Array.isArray(responsePetData?.pet.purchasedItems)
                    ? responsePetData.pet.purchasedItems
                    : []
            )

            setUserLevel(responsePetData?.user.level || 0)

            setIsLoading(false)
        }

        fetchItems()
    }, [])

    const renderPetshopItem = useCallback(
        ({ item }: { item: Item }) => {
            const hasItem = petPurchasedItems.some((p) => p.id === item.id)
            const isActive = petActiveItems.some((p) => p.id === item.id)
            const quantity =
                petPurchasedItems.find((p) => p.id === item.id)?.quantity || 0

            return (
                <PetshopItem
                    item={{
                        id: item.id,
                        name: item.name,
                        category: item.category,
                        price: item.price,
                        type: item.type,
                        has_required_level: userLevel >= item.requiredLevel,
                        has_item: hasItem,
                        is_active: isActive,
                        quantity,
                    }}
                />
            )
        },
        [petPurchasedItems, petActiveItems, userLevel]
    )

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

            {isLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
            ) : (
                <View style={styles.itemsShopBox}>
                    <FlatList
                        style={{ width: '100%' }}
                        data={itemsShop.filter(
                            (item) => item.category === selectedFilter.category
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderPetshopItem}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 10 }} />
                        )}
                    />
                </View>
            )}
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
