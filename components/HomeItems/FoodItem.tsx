import { StyleSheet, View, Image, TouchableWithoutFeedback, Dimensions } from 'react-native'

const {height, width} = Dimensions.get('window');

const FoodItem = () => {
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

export default FoodItem

const styles = StyleSheet.create({
  cbox: {
    width: '26.5%',
    height: '9%',
    position: 'absolute',
    bottom: height/5.25,
    right: width/1.45,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    //backgroundColor: 'blue',
}
})
