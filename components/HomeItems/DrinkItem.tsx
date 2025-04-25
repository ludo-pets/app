import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native'
import { InteractionTouch } from './InteractionTouch'

const { height, width } = Dimensions.get('window')

const DrinkItem = () => {
    const onPress = () => {
        InteractionTouch('drink')
    }

    return (
        <View style={styles.cbox}>
            <TouchableWithoutFeedback onPress={onPress}>
                <Image
                    style={{
                        width: `100%`,
                        height: `100%`,
                        resizeMode: 'contain',
                    }}
                    source={require('@/assets/images/homescreen/poteB.png')}
                />
            </TouchableWithoutFeedback>
        </View>
    )
}

export default DrinkItem

const styles = StyleSheet.create({
    cbox: {
        width: '27.5%',
        height: '9.02%',
        position: 'absolute',
        bottom: height / 9.963,
        right: width / 1.45,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        //backgroundColor: 'blue',
    },
})
