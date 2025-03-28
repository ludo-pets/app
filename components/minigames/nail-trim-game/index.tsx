import { useEffect, useState } from "react";
import GameBoard from "./GameBoard";
import StartGameDialog from "./StatGameDialog";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import EndGameDialog from "./EndGameDialog";
const { width, height } = Dimensions.get("window");
export default function NailTrimGame() {
    const [started, setStarted] = useState(false);
    const [ended, setEnded] = useState(false);
    const [score, setScore] = useState(0);

    // const addScore = () => {
    //     setScore(score + 1);
    // }
    
    useEffect(() => {
        console.log("Score: ", score);
    }, [score]);

    return(
        <GestureHandlerRootView
        style={styles["game-container"]}
        >
            {/**placeholder do header enquanto não temos o componente*/}
            <Animated.View style={styles.header}>
                <Animated.Image style={styles.icon} source={{uri:"https://img.icons8.com/?size=100&id=26194&format=png&color=000000"}}/>
                <h1 style={styles.title}>Minigames</h1>
            </Animated.View>

            {/**placeholder do componente de iniciar um minigame enquanto não temos o componente*/}
            {!started && <StartGameDialog startGame={setStarted}/>}
            {!ended && <EndGameDialog startGame={setStarted}/>}



            <GameBoard />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    "game-container": {
        backgroundColor: "#fff",
        boxSizing: "content-box",
        height: "100%",
        width: width,
        padding: 0,
        margin: 0,
        position: "relative",
    },
    header:{
        width: "100%",
        display: "flex",
        boxShadow: "0 0 0px 4px rgba(0,0,0,0.2)",
        color: "#5B5B5B",
        flexDirection: "row",
        alignItems:"center",
        justifyContent:"center",
        paddingRight: 10,
        paddingLeft:10,
        position: "relative",
    },
    icon:{
        width: width / 10,
        height: width / 10,
        flexGrow: 1,
        opacity:0.6,
        position: "absolute",
        left: width / 20,
    },
    title: {
        flexGrow: 50,
        textAlign: "center"
    }

})