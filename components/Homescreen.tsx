import { StyleSheet, View } from 'react-native'
import Petitem from '@/components/Petitem'
import Petlitteritem from '@/components/Petlitteritem'
import Beditem from '@/components/Beditem'
import Flooritem from '@/components/Flooritem'
import Toyitem from '@/components/Toyitem'
import Fooditem from '@/components/Fooditem'
import Drinkitem from '@/components/Drinkitem'
import Wallpaperitem from '@/components/Wallpaperitem'

const Homescreen = () => {
  return (
    <View style = {styles.container}>
      <Wallpaperitem/>
      <Flooritem/>
      <Petitem/>
      <Petlitteritem/>
      <Beditem/>
      <Toyitem/>
      <Fooditem/>
      <Drinkitem/>
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
    }
})