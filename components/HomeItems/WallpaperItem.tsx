import { StyleSheet, View, Image } from 'react-native'

const WallpaperItem = () => {
  return (
    <View style = {styles.cbox}>
        <Image style = {{width: `100%`, height: `100%`}} source={require('@/assets/images/homescreen/fundohs.png')}/>
    </View>
  )
}

export default WallpaperItem

const styles = StyleSheet.create({
  cbox: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    //backgroundColor: `blue`,
}
})
