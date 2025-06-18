import { ReactNode } from 'react'
import {
    Animated,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native'
import Button from './Dialog.Button'
import Text from './Dialog.Text'
import ButtonArea from './Dialog.ButtonArea'
import Icon from './Dialog.Icon'
export type DialogContainerProps = {
    children: ReactNode
    containerStyle?: ViewStyle
}

const { width } = Dimensions.get('window')
function Container({ children, containerStyle }: DialogContainerProps) {
    return (
        <Animated.View style={style.overlay}>
            <Animated.View style={[style.startDialog, containerStyle]}>
                {children}
            </Animated.View>
        </Animated.View>
    )
}
const style = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    startDialog: {
        padding: 25,
        width: width * 0.8,
        // height: width * 0.8,
        backgroundColor: '#fefefe',
        borderRadius: 25,
        display: 'flex',
        fontFamily: 'Inter',
        flexDirection: 'column',
        gap: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 10,
    },
})

export default {
    Container,
    Button,
    ButtonArea,
    Text,
    Icon,
}
