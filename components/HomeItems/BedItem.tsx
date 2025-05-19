import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
    Platform,
} from 'react-native'
import ItemProps from '@/dtos/ItensProps'
import { scheduleNeedNotification, cancelNeedNotifications } from '@/utils/scheduleNotifications'

const { height, width } = Dimensions.get('window')

const BedItem = ({ update }: ItemProps) => {
    const onPress = () => {
        update('sleep')
        
        cancelNeedNotifications('sleep')
            .then(() => {
                scheduleNeedNotification('sleep')
            })
            .catch(error => {
                console.error('Erro ao agendar notificação de sono:', error)
            })
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
        bottom: Platform.OS === 'ios' ? height / 4.0 : height / 3.33,
        left: width / 1.8,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex'
    },
})
