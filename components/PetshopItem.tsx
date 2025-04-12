import { Image, StyleSheet } from "react-native"

export interface PetshopItemProps {
    id: number;
    name: string;
    price: number;
    image: string;
    category: "bed" | "food" | "toy" | "wc" | "floor" | "wallpaper";
    required_level: number;
    is_active: boolean;
    quantity: number
}


export default function PetshopItem ({item}: {item: PetshopItemProps}) {
    return(
        <view style={ styles.item }>
            <Image source={{ uri: item.image}}/>
            <view>
                <view>{item.name}</view>
                <view>{item.price}</view>
                <view style={
                    {
                        ...styles.active,
                        display: item.is_active ? "flex" : "none"
                    }
                }>Ativo</view>
                <view></view>
            </view>
        </view>
    );
}

const styles = StyleSheet.create({
    item: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
    },
    image: {

    },
    active: {

    },
});