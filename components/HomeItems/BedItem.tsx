import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
    Platform,
} from 'react-native'
import { InteractionTouch } from './InteractionTouch'
import ItemProps from '@/dtos/ItensProps'

const { height, width } = Dimensions.get('window')

const BedItem = ({update}:ItemProps) => {
    const onPress = () => {
        update('sleep')
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
                    source={require('@/assets/images/homescreen/almofada.png')}
                />
            </TouchableWithoutFeedback>
        </View>
    )
}

export default BedItem

const styles = StyleSheet.create({
    cbox: {
        width: '44.2%',
        height: '15%',
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? height / 4.00 : height / 3.33,
        left: width / 1.8,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        //backgroundColor: 'blue',
    },
})
