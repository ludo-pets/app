import { Children, ReactNode } from "react";
import { Animated, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import Button from "./Dialog.Button";
import Text from "./Dialog.Text";
import ButtonArea from "./Dialog.ButtonArea";

export type DialogContainerProps= { 
    children: ReactNode
}

const { width, height } = Dimensions.get("window");
function Container({children}: DialogContainerProps){   
    return(
        <Animated.View style={style.overlay}>
            <Animated.View style={style.startDialog}>
                {children}
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
        flexDirection: "column",
        gap: 20,
        justifyContent: "space-around",
        alignItems: "center",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -(width * 0.8) / 2 }, { translateY: -(width * 0.8) / 2 }],
        zIndex:10
    },
})

export default {
    Container,
    Button,
    ButtonArea,
    Text,
}