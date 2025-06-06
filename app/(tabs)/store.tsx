import { useEffect, useState, useCallback } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    ActivityIndicator,
    FlatList,
} from 'react-native'
import Item from '@/dtos/Item'
import { Pet } from '@/dtos/Pet'
import PetshopItem from '@/components/PetshopItem'
import { useUserPetStore } from '@/stores/userPetStore'
import { useItemStore } from '@/stores/itemStore'

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
    const { pet, user } = useUserPetStore()
    const { fetchItems, items, loading } = useItemStore()
    const [petActiveItems, setPetActiveItems] = useState<Pet['purchasedItems']>(
        []
    )
    const [petPurchasedItems, setPetPurchasedItems] = useState<
        Pet['purchasedItems']
    >([])

    useEffect(() => {
        const fetchItensUseEffect = async () => {
            fetchItems()
            setPetActiveItems(
                Array.isArray(pet?.activeItems) ? pet.activeItems : []
            )

            setPetPurchasedItems(
                Array.isArray(pet?.purchasedItems) ? pet.purchasedItems : []
            )
        }
        fetchItensUseEffect()
    }, [])

    const renderPetshopItem = useCallback(
        ({ item }: { item: Item }) => {
            const hasItem = petPurchasedItems.some((p) => p.itemId === item.id)
            const isActive = petActiveItems.some((p) => p.itemId === item.id)
            const purchasedRecord = petPurchasedItems.find(
                (p) => p.itemId === item.id
            )
            const quantity = purchasedRecord?.quantity ?? 0

            return (
                <PetshopItem
                    item={{
                        id: item.id,
                        name: item.name,
                        category: item.category,
                        price: item.price,
                        has_required_level:
                            user &&
                            user?.level >= item.requiredLevel &&
                            user?.money >= item.price,
                        has_item: hasItem,
                        image: item.image,
                        is_active: isActive,
                        quantity,
                        type: item.type,
                    }}
                />
            )
        },
        [petPurchasedItems, petActiveItems, user]
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

            {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
            ) : (
                <View style={styles.itemsShopBox}>
                    <FlatList
                        style={{ width: '100%' }}
                        data={items.filter(
                            (item) => item.category === selectedFilter.category
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderPetshopItem}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 0 }} />
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
        backgroundColor: '#fefefe',
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
