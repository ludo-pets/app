import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
export const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "#fff",
        boxSizing: "content-box",
        height: "100%",
        width: width,
        padding: 0,
        margin: 0,
        position: "relative",
    },
    trimmerImage: {
        position: "absolute",
    },
});