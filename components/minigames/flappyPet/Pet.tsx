import { View, Text, StyleSheet } from "react-native";

export default function Pet(){
    return (
        <View style={styles.pet}>
           <Text>Pet</Text> 
        </View>
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
    }
})