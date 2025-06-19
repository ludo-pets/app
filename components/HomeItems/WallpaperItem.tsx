import { StyleSheet, View, Image } from 'react-native'
import { HomeProps } from '../Homescreen'

const WallpaperItem = ({image}: HomeProps) => {
  
    return (
        <View style={styles.cbox}>
            {image && image[0] === `#` ? (
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
                    source={{ uri: image }}
                />
            )}
        </View>
    )
}

export default WallpaperItem

const styles = StyleSheet.create({
    cbox: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        //backgroundColor: `blue`,
    },
})
