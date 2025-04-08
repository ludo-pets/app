import { StyleSheet, Text, TouchableOpacity } from 'react-native'
export type DialogButtonProps = {
    action: () => void
    text: string
    color?: string
    background?: string
}

export default function DialogButton({
    action,
    text,
    color = '#5B5B5B',
    background = '#CFE2A8',
}: DialogButtonProps) {
    return (
        <TouchableOpacity
            style={{ ...style.dialogButton, backgroundColor: background }}
            onPress={action}
        >
            <Text style={{ ...style.buttonText, color }}>{text}</Text>
        </TouchableOpacity>
    )
}
const style = StyleSheet.create({
    dialogButton: {
        backgroundColor: '#D9E8B9',
        padding: 10,
        borderRadius: 10,
        boxShadow: '2px 2px 4px 0px rgba(0,0,0,0.2)',
        alignItems: 'center',
        width: '60%',
        fontFamily: 'Roboto',
    },
    buttonText: {
        fontFamily: 'Roboto',

        fontSize: 25,
        fontWeight: 500,
        color: '#5B5B5B',
    },
})
