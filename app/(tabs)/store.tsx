
import PetshopItem, { PetshopItemProps } from '@/components/PetshopItem';
import { StyleSheet, View, Text, ScrollView } from 'react-native'
const itemsMockup: PetshopItemProps[] = [
    {
        id: 0,
        category: 'food',
        name: "Ração de salmão",
        price: 900.00,
        required_level: 3,
        is_active: true,
        quantity: 5,
        has_item: true,
    },
    {
        id: 1,
        category: 'bed',
        name: "Almofada macia",
        price: 1000,
        required_level: 3,
        is_active: false,
        quantity: 5,
        has_item: false
    }
];
export default function StoreScreen() {
    return (
        <View >
            <ScrollView   style={
                {
                    ...styles.scrollView,
                    
                }
            }>
            {itemsMockup.map((item: PetshopItemProps) => <PetshopItem item={item} />)}
            </ScrollView>
            <View style={styles.separator} />
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView:{
        height: "100%",
        width: "100%",
        padding: "2%",
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
