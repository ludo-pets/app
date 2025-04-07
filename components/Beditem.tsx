import { StyleSheet, View, Image, TouchableWithoutFeedback, Dimensions } from 'react-native'

const {height, width} = Dimensions.get('screen');

const Beditem = () => {
  const onPress = () => {
    console.log("the cat won't sleep here")
  };

  return (
    <View style = {styles.cbox}>
      <TouchableWithoutFeedback onPress={onPress}>
        <Image style = {{width: `100%`, height: `100%`,}} source={require('@/assets/images/homescreen/almofada.png')}/>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default Beditem

const styles = StyleSheet.create({
  cbox: {
    width: '44.2%',
    height: '15%',
    position: 'absolute',
    top: height/2.123,
    left: width/1.8,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    //backgroundColor: 'blue',
}
})