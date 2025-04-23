
import PetshopItem, { PetshopItemProps } from '@/components/PetshopItem';
import { StyleSheet, View, Text, ScrollView } from 'react-native'

// este é um mockup dos dados que serão recebidos do firebase, podem deletar assim que tiver os dados corretos.
const itemsMockup: PetshopItemProps[] = [
    {
        id: 0,
        category: 'food',
        name: "Ração de salmão",
        price: 900.00,
        has_required_level: true,
        is_active: true,
        quantity: 5,
        has_item: true,
    },
    {
        id: 1,
        category: 'bed',
        name: "Almofada macia",
        price: 1000,
        has_required_level: true,
        is_active: false,
        quantity: 5,
        has_item: true
    },
    {
        id: 2,
        category: 'toy',
        name: "Bola de lã",
        price: 1500,
        has_required_level: true,
        is_active: false,
        quantity: 5,
        has_item: false
    },
    {
        id: 3,
        category: 'toy',
        name: "Arranhador",
        price: 2000,
        has_required_level: false,
        is_active: false,
        quantity: 5,
        has_item: false
    }
];
export default function StoreScreen() {
    return (
        <View>
            <ScrollView   style={
                {
                    ...styles.scrollView,
                    
                }

            } >
                <view style={styles.scrollViewContent}>
                    { itemsMockup.map((item: PetshopItemProps) => <PetshopItem item={item} />) }
                </view>
            </ScrollView>
            <View style={styles.separator} />
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView:{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
    },
    scrollViewContent: {
        height: "100%",
        width: "100%",
        padding: 5,
        display: "flex",
        flexDirection: "column",
        gap: 5,
        justifyContent: "flex-start",
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
})
