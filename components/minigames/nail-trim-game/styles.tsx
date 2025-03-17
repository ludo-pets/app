import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#cfcfcf",
        boxSizing: "content-box",
        height: "100%",
        width: "100%",
        padding: 0,
        margin: 0,
        position: "relative",
        flexDirection: "column",
        display: "flex",

    },
    gameContainer: {
        display: "flex",
        alignItems: "center",
        width: width,
        padding: 0,
        flex: 1,
        backgroundColor: "#ddd",
        borderStyle: "solid",
        borderColor: "#000",
        position: "relative",
        borderWidth: 5,
        flexGrow: 2,
        overflow: "hidden",
    },
    pawImage: {
        position: "absolute",
        resizeMode: "contain",
        width: width * 0.9,
        height: width * 0.9,
        bottom: 0 - width / 5,
        
    },
    TrimmerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        borderColor: "#000",
        borderWidth: 5,
        width: width,
        backgroundColor: "#cfcfcf",
        flexGrow: 1,

    },
    nail:{
        width: width * 0.1,
        height: width * 0.1,
        position: "absolute",
        resizeMode: "contain",
    },
    trimmerImage: {
        width: "100%",
        height: "100%",
        position: "absolute",
        resizeMode: "contain",
    },
});