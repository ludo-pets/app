import Homescreen from '@/components/Homescreen'
import { StyleSheet, View, Text } from 'react-native'

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Homescreen/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
