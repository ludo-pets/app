import { Image, View } from "react-native";
import { styles } from "./styles";
import {GestureHandlerRootView, PanGestureHandler} from "react-native-gesture-handler"
import GameScreen from "./GameScreen";
import TrimmerContainer from "./TrimmerContainer";
export default function NailTrimGame() {
    return (
        <GestureHandlerRootView style={styles.mainContainer}>
            <View style={styles.gameContainer}>
                <GameScreen/>
                <TrimmerContainer/>
            </View>
        </GestureHandlerRootView>
    )
}