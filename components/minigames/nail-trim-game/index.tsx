import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Dimensions, StyleSheet } from "react-native";

import StartGameDialog from "./StatGameDialog";
import EndGameDialog from "./EndGameDialog";
import GameBoard from "./GameBoard";
import { Nail } from "./types";

const { width } = Dimensions.get("window");

const catNailsSet: Nail[] = [
    { id: 1, position: { x: 0.215, y: 0.6 }, rotation: "85deg", isTrimmed: false },
    { id: 2, position: { x: 0.248, y: 0.495 }, rotation: "0deg", isTrimmed: false },
    { id: 3, position: { x: 0.335, y: 0.45 }, rotation: "50deg", isTrimmed: false },
    { id: 4, position: { x: 0.48, y: 0.5}, rotation: "45deg", isTrimmed: false },
];

export default function NailTrimGame() {
    const [started, setStarted] = useState(false);
    const [ended, setEnded] = useState(false);
    const [score, setScore] = useState(0);
    
    const addScore = () => {
        setScore(score + 1);
    }
    useEffect(() => {
        if(score >= 4) setEnded(true); 
    }, [score]);

    return(
        <GestureHandlerRootView
        style={styles["game-container"]}
        >
            { !started && <StartGameDialog startGame={setStarted}/> }


            {
            /**Na propriedade endGame vai a função que vai ser executada ao clicar no botão avançar 
             * A função setStarted só ta de exemplo, podem mudar ela para outra função.
            */
            }
            { ended && <EndGameDialog endGame={setStarted }/>}

            {/**minigame do gato*/}
            <GameBoard 
                pawImage={require("@/assets/images/minigames/nail-trimmer/paw.png")}
                addScore={addScore}
                nailsSet={catNailsSet}
            />

            {/**minigame do cachorro, quando tiver os assets do cachorro*/}
            {/* <GameBoard 
                pawImage={require("@/assets/images/minigames/nail-trimmer/paw-dog.png")}
                addScore={addScore}
                nailsSet={dogNailsSet}
            /> */}
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
