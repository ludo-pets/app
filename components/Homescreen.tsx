import { StyleSheet, View } from 'react-native'
import PetItem from '@/components/HomeItems/PetItem'
import WcItem from '@/components/HomeItems/WcItem'
import BedItem from '@/components/HomeItems/BedItem'
import FloorItem from '@/components/HomeItems/FloorItem'
import ToyItem from '@/components/HomeItems/ToyItem'
import FoodItem from '@/components/HomeItems/FoodItem'
import DrinkItem from '@/components/HomeItems/DrinkItem'
import Wallpaperitem from '@/components/HomeItems/WallpaperItem'
import { useUserPetStore } from '@/stores/userPetStore'
import { Pet } from '@/dtos/Pet'
import { useState } from 'react'

const Homescreen = () => {
    const [interactingWithItem, setInteractingWithItem] = useState(false)
    const updatePet = useUserPetStore((state) => state.updatePet)
    const pet = useUserPetStore((state) => state.pet)

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
            <Wallpaperitem />
            <FloorItem />
            <PetItem interactingWithItem={interactingWithItem} />
            <WcItem
                setInteractingWithItem={setInteractingWithItem}
                update={(item) => updateTime(item as keyof Pet['wellBeing'])}
            />
            <BedItem
                setInteractingWithItem={setInteractingWithItem}
                update={(item) => updateTime(item as keyof Pet['wellBeing'])}
            />
            <ToyItem
                setInteractingWithItem={setInteractingWithItem}
                update={(item) => updateTime(item as keyof Pet['wellBeing'])}
            />
            <FoodItem
                setInteractingWithItem={setInteractingWithItem}
                update={(item) => updateTime(item as keyof Pet['wellBeing'])}
            />
            <DrinkItem
                setInteractingWithItem={setInteractingWithItem}
                update={(item) => updateTime(item as keyof Pet['wellBeing'])}
            />
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
