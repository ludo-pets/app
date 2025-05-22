import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native'
import { InteractionTouch } from './InteractionTouch'
import ItemProps from '@/dtos/ItensProps'

const { height, width } = Dimensions.get('window')

const FoodItem = ({ update }: ItemProps) => {
    const onPress = () => {
        update('hunger')
    }

    return (
        <View style={styles.cbox}>
            <TouchableWithoutFeedback onPress={onPress}>
                <Image
                    style={{
                        width: `100%`,
                        height: `100%`,
                        resizeMode: `contain`,
                    }}
                    source={require('@/assets/images/homescreen/poteC.png')}
                />
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
        bottom: height / 5.25,
        right: width / 1.45,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        //backgroundColor: 'blue',
    },
})
