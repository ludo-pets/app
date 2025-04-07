import { StyleSheet, View, Image, TouchableWithoutFeedback, Dimensions } from 'react-native'

const {height, width} = Dimensions.get('screen');

const Toyitem = () => {
  const onPress = () => {
    console.log("toy.")
  };

  return (
    <View style = {styles.cbox}>
      <TouchableWithoutFeedback onPress={onPress}>
        <Image style = {{width: `100%`, height: `100%`, resizeMode: `contain`}} source={require('@/assets/images/homescreen/brinquedo.png')}/>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default Toyitem

const styles = StyleSheet.create({
  cbox: {
    width: '47%',
    height: '41.7%',
    position: 'absolute',
    top: height/4.3,
    right: width/1.99,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    //backgroundColor: 'blue',
}
})