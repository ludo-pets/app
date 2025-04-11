import { StyleSheet, Text } from 'react-native'

export type DialogTextProps = {
    content: string
    style?: object
    color?: string
}

export default function DialogText({ content, style, color }: DialogTextProps) {
    return (
        <Text style={{ ...styles.dialogText, ...style, color }}>{content}</Text>
    )
}
const styles = StyleSheet.create({
    dialogText: {
        fontFamily: 'Inter',
        fontSize: 25,
        textAlign: 'center',
        width: '80%',
        wordWrap: 'break-word',
    },
})
