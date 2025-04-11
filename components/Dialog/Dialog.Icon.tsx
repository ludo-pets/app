import { ReactNode } from 'react'
import { Animated, Image, StyleSheet, Text } from 'react-native'
import Svg from 'react-native-svg'

export type DialogIconProps = { content: ReactNode }

export default function DialogIcon({ content }: DialogIconProps) {
    return <Animated.View style={style.dialogIcon}>{content}</Animated.View>
}
const style = StyleSheet.create({
    dialogIcon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        overflow: 'hidden',
        marginBottom: 0,
        marginTop: '-30%',
    },
})
