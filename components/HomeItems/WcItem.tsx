import { StyleSheet, View, Image, TouchableWithoutFeedback, Dimensions } from 'react-native'

const {height, width} = Dimensions.get('window');

const WcItem = () => {
  const onPress = () => {
    console.log("this isn't called sandbox!")
  };

  return (
    <View style = {styles.cbox}>
      <TouchableWithoutFeedback onPress={onPress}>
        <Image style = {{width: `100%`, height: `100%`}} source={require('@/assets/images/homescreen/caixa_de_areia.png')}/>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default WcItem

const styles = StyleSheet.create({
  cbox: {
    width: '49%',
    height: '8%',
    position: 'absolute',
    bottom: height/66,
    left: width/1.96,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    //backgroundColor: 'blue',
}
})
