import { StyleSheet, View } from 'react-native'
import Petitem from '@/components/HomeItems/PetItem'
import WcItem from '@/components/HomeItems/WcItem'
import Beditem from '@/components/HomeItems/BedItem'
import Flooritem from '@/components/HomeItems/FloorItem'
import Toyitem from '@/components/HomeItems/ToyItem'
import Fooditem from '@/components/HomeItems/FoodItem'
import Drinkitem from '@/components/HomeItems/DrinkItem'
import Wallpaperitem from '@/components/HomeItems/WallpaperItem'
import { useUserPetStore } from '@/stores/userPetStore'
import { Pet } from '@/dtos/Pet'
import { useItemStore } from '@/stores/itemStore'

export interface HomeProps {
  image?: string
}

const Homescreen = () => {
    const updatePet = useUserPetStore((state) => state.updatePet)
    const pet = useUserPetStore((state) => state.pet)
    const itemsAdapter = useUserPetStore((state) => state.itemsAdapter)
    

    const updateTime = (item: keyof Pet['wellBeing']) => {
        if (pet) {
            updatePet(pet?.id, {
                wellBeing: {
                    ...pet.wellBeing,
                    [item]: new Date().toString(),
                },
            })
        }
    }

    return (
        <View style={styles.container}>
            <Wallpaperitem image={itemsAdapter.wallpaper} />
            <Flooritem image={itemsAdapter.floor} />
            <Petitem />
            <WcItem image={itemsAdapter.wc} update={(item) => updateTime(item as keyof Pet['wellBeing'])} />
            <Beditem image={itemsAdapter.bed} update={(item) => updateTime(item as keyof Pet['wellBeing'])} />
            <Toyitem image={itemsAdapter.toy} update={(item) => updateTime(item as keyof Pet['wellBeing'])} />
            <Fooditem image={itemsAdapter.food} update={(item) => updateTime(item as keyof Pet['wellBeing'])} />
            <Drinkitem image={itemsAdapter.water} update={(item) => updateTime(item as keyof Pet['wellBeing'])} />
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
