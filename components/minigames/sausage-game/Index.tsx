import { SafeAreaView, StyleSheet, View } from "react-native"
import { PanGestureHandler } from "react-native-gesture-handler";
import { Colors } from "react-native/Libraries/NewAppScreen"

export default function Game(): JSX.Element {

    const handleGesture = (event: any) => {
        const { translationX, translationY } = event.nativeEvent;
        console.log(translationX, translationY);

        if (Math.abs(translationX) > Math.abs(translationY)) {
            if (translationX > 0) {

            } else {
                if (translationY > 0)
            } else {
        }
        }
    };
    return(
        <PanGestureHandler onGestureEvent={handleGesture}>
            <SafeAreaView style={styles.container}></SafeAreaView>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    }
})