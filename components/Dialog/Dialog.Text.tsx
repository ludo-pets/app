import { StyleSheet, Text } from "react-native";

export type DialogTextProps = {content: string}

export default function DialogText({content}:DialogTextProps ){ 
    return(
        <Text style={style.dialogText}>{content}</Text>
    );
}
const style = StyleSheet.create({
    dialogText: {
        fontFamily: "Roboto",
        fontSize: 25,
        textAlign: "center",
        width: "80%",
        wordWrap: "break-word",
    },
})
