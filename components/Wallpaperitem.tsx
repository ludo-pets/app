import { StyleSheet, View, Image, Dimensions } from 'react-native'

const {height, width} = Dimensions.get('screen');

const Flooritem = () => {
  return (
    <View style = {styles.cbox}>
        <Image style = {{width: `100%`, height: `100%`}} source={require('@/assets/images/homescreen/fundohs.png')}/>
    </View>
  )
}

export default Flooritem

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