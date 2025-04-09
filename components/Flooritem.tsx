import { StyleSheet, View, Image, Dimensions } from 'react-native'

const {height, width} = Dimensions.get('window');

const Flooritem = () => {
  return (
    <View style = {styles.cbox}>
        <Image style = {{width: `100%`, height: `100%`}} source={require('@/assets/images/homescreen/chao_verde.png')}/>
    </View>
  )
}

export default Flooritem

const styles = StyleSheet.create({
  cbox: {
    width: '100%',
    height: '39.77%',
    position: 'absolute',
    bottom: height/90000,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    //backgroundColor: `blue`,
}
})