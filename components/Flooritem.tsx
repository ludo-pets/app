import { StyleSheet, View, Image, Dimensions } from 'react-native'

const {height, width} = Dimensions.get('screen');

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
    height: '40.693%',
    position: 'absolute',
    top: height/1.82,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    //backgroundColor: `blue`,
}
})