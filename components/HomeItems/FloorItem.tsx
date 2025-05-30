import { StyleSheet, View, Image, Dimensions } from 'react-native'
import { HomeProps } from '../Homescreen'

const { height } = Dimensions.get('window')

const FloorItem = ({ image }: HomeProps) => {
    return (
        <View style={styles.cbox}>
            {
                image && image[0] === `#` ? (
                    <View
                        style={{
                            width: `100%`,
                            height: `100%`,
                            backgroundColor: `${image}`,
                        }}
                    />
                ) : (
                    <Image
                        style={{ width: `100%`, height: `100%` }}
                        source={require('@/assets/images/homescreen/chao_verde.png')}
                    />
                )
            }
        </View>
    )
}

export default FloorItem

const styles = StyleSheet.create({
    cbox: {
        width: '100%',
        height: '39.77%',
        position: 'absolute',
        bottom: height / 90000,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        //backgroundColor: `blue`,
    },
})
