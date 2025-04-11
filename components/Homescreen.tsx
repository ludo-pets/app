import { StyleSheet, View } from 'react-native'
import Petitem from '@/components/HomeItems/PetItem'
import WcItem from '@/components/HomeItems/WcItem'
import Beditem from '@/components/HomeItems/BedItem'
import Flooritem from '@/components/HomeItems/FloorItem'
import Toyitem from '@/components/HomeItems/ToyItem'
import Fooditem from '@/components/HomeItems/FoodItem'
import Drinkitem from '@/components/HomeItems/DrinkItem'
import Wallpaperitem from '@/components/HomeItems/WallpaperItem'

const Homescreen = () => {
    return (
        <View style={styles.container}>
            <Wallpaperitem />
            <Flooritem />
            <Petitem />
            <WcItem />
            <Beditem />
            <Toyitem />
            <Fooditem />
            <Drinkitem />
        </View>
    )
}

export default Homescreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
})
