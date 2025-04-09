import { StyleSheet, View, Image, TouchableWithoutFeedback, Dimensions } from 'react-native'

const {height, width} = Dimensions.get('window');

const Petitem = () => {
  const onPress = () => {
    console.log("don't touch the cat!")
  };

  return (
    <View style = {styles.cbox}>
      <TouchableWithoutFeedback onPress={onPress}>
        <Image style = {{width: `100%`, height: `100%`, resizeMode: `contain`}} source={require('@/assets/images/homescreen/gaaato.png')}/>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default Petitem

const styles = StyleSheet.create({
  cbox: {
    width: '42%',
    height: '20%',
    position: 'absolute',
    bottom: height/7.35,
    right: width/6.9,
    //backgroundColor: 'blue',
}
})