import { StyleSheet, View, Image, TouchableWithoutFeedback, Dimensions } from 'react-native'

const {height, width} = Dimensions.get('screen');

const Fooditem = () => {
  const onPress = () => {
    console.log("food.")
  };

  return (
    <View style = {styles.cbox}>
      <TouchableWithoutFeedback onPress={onPress}>
        <Image style = {{width: `100%`, height: `100%`, resizeMode: `contain`}} source={require('@/assets/images/homescreen/poteC.png')}/>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default Fooditem

const styles = StyleSheet.create({
  cbox: {
    width: '26.5%',
    height: '9%',
    position: 'absolute',
    top: height/1.55,
    right: width/1.45,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    //backgroundColor: 'blue',
}
})