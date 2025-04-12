
import PetshopItem, { PetshopItemProps } from '@/components/PetshopItem';
import { StyleSheet, View, Text, ScrollView } from 'react-native'
const itemsMockup: PetshopItemProps[] = [
    {
        id: 0,
        category: 'food',
        image: "https://cdn-icons-png.flaticon.com/512/1152/1152771.png",
        name: "ração de salmão",
        price: 900.00,
        required_level: 3,
        is_active: true,
        quantity: 5,
    },
    {
        id: 2,
        category: 'food',
        image: "https://cdn-icons-png.flaticon.com/512/1152/1152771.png",
        name: "ração de salmão",
        price: 900.00,
        required_level: 3,
        is_active: true,
        quantity: 5,
    }
];
export default function StoreScreen() {
    return (
        <View style={styles.container}>
            <ScrollView style={
                { display: "flex", flexDirection: "column", flexWrap: "nowrap" }
            }>
            {itemsMockup.map((item: PetshopItemProps) => <PetshopItem item={item} />)}
            </ScrollView>
            <View style={styles.separator} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
