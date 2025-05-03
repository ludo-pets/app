import { Animated, Text, StyleSheet } from "react-native";

interface PetProps{
    petBottom: Animated.Value;
}

export default function Pet({petBottom}: PetProps) {
    return (
        <Animated.View style={[styles.pet, {bottom: petBottom}]}>
            <Text style= {{color: "white"}}>Pet</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    pet: {
        width: 50,
        height: 50,
        backgroundColor: "blue",
        position: "absolute",
        bottom: 100,
        left: 50,
        zIndex: 4,
        justifyContent:"center",
        alignItems: "center"

    }
})