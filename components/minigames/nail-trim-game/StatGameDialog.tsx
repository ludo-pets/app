import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";

const { width, height } = Dimensions.get("window");
export default function StartGameDialog({startGame}: {startGame: (value: boolean) => void}){
    return(
        <Animated.View style={style.overlay}>
            <Animated.View style={style.startDialog}>
                <Text style={style.dialogText}>
                    Arraste o cortador para cima das unhas de seu gatinho para corta-las
                </Text>
                <TouchableOpacity
                    style={style.dialogButton}
                    onPress={() => startGame(true)}
                >
                    
                    <Text style={style.buttonText}>Iniciar</Text>
                </TouchableOpacity>

            </Animated.View>
        </Animated.View>
    )
}
const style = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 5,
    },
    startDialog: {
        position: "absolute",
        padding: 25,
        width:  width*0.8,
        height: width*0.8,
        backgroundColor: "#fefefe",
        borderRadius: 25,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -(width * 0.8) / 2 }, { translateY: -(width * 0.8) / 2 }],
        zIndex:10
    },

    dialogButton: {
        backgroundColor: "#D9E8B9",
        padding: 10,
        borderRadius: 10,
        boxShadow: "2px 2px 4px 0px rgba(0,0,0,0.2)",
        alignItems: "center",
        width: "50%",
        fontFamily: "Roboto",
    },
    dialogText: {
        fontFamily: "Roboto",
        fontSize: 25,
        textAlign: "center",
        width: "80%",
        wordWrap: "break-word",
    },
    buttonText: {}
})