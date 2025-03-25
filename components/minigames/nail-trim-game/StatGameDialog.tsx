import { Animated, Button, StyleSheet } from "react-native";

export default function StartGameDialog(){
    return(
        <Animated.View style={style.startDialog}>
            <Button 
                title="START"
                color={"red"}
                
                
            />

        </Animated.View>
    )
}
const style = StyleSheet.create({
    startDialog: {
        position: "absolute",
        
        top:0,
        left:0
    }
})