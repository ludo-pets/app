import { ReactNode } from 'react'
import { Animated, StyleSheet } from 'react-native'
export type DialogButtonAreaProps = {
    children?: ReactNode
}
export default function DialogButtonArea({ children }: DialogButtonAreaProps) {
    return <Animated.View style={style.buttonArea}>{children}</Animated.View>
}
const style = StyleSheet.create({
    buttonArea: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        width: '100%',
        justifyContent: 'space-around',
    },
})
