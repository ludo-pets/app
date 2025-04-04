import { Dimensions, Image, Animated, ImageSourcePropType, StyleSheet } from "react-native";
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from "react-native-gesture-handler";
import { Nail, NailProgress } from './types';
import { useRef, useState } from 'react';
import Svg, { Circle } from "react-native-svg";

const { width, height } = Dimensions.get("window");

//trimmer
const trimmer_initial_position = { x: width /4, y: height /6 };
let trimmer_current_position = trimmer_initial_position;
const openTrimmer = require("@/assets/images/minigames/nail-trimmer/trimmer-open.png");
const closeTrimmer = require("@/assets/images/minigames/nail-trimmer/trimmer-closed.png");;

//paw
const pawSize = height / 2;
const nailSize = pawSize / 6;

const CUT_TIME = 1000;

export type GameBoardProps = {
    addScore: () => void,
    pawImage: ImageSourcePropType,
    nailsSet: Nail[],

}
export default function GameBoard({addScore, pawImage, nailsSet}: GameBoardProps) {
    const [nails, setNails] = useState<Nail[]>(nailsSet);
    const [trimmer, setTrimmer] = useState(trimmer_initial_position);
    const [nailProgress, setNailProgress] = useState<NailProgress>({});
    const [isTrimming, setIsTrimming] = useState(false);
    
    const trimmerTimeout = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
    const intervalRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
    const handleGesture = (e: PanGestureHandlerGestureEvent) => {
        setTrimmer({ x:trimmer_current_position.x + e.nativeEvent.translationX, y: trimmer_current_position.y + e.nativeEvent.translationY });

        nails.forEach((nail) => {
            if (nail.isTrimmed) return;
            const nailX = nail.position.x;
            const nailY = nail.position.y;
            const nailCenterX = nailX + nailSize / 2;
            const nailCenterY = nailY + nailSize / 2;
            const trimmerCenterX = e.nativeEvent.translationX + trimmer_current_position.x  + nailSize / 2;
            const trimmerCenterY = e.nativeEvent.translationY + trimmer_current_position.y + nailSize / 2;
            
            console.log("trimmer x: ", ((trimmerCenterX - nailSize /2) - ((width - pawSize) /2)));
            console.log("trimmer y: ", (trimmerCenterX - nailSize /2));
            console.log(nail.id +" nail x: ", (pawSize * nailX ));
            console.log(nail.id +" nail y: ", ((height-pawSize) + nailCenterY /2 ))
            
            

            const distance = Math.sqrt(
                ((height -nailCenterX) - trimmerCenterX) ** 2 + ((height - pawSize) - trimmerCenterY) ** 2
            );

            if (distance < nailSize /2) {
                if (!trimmerTimeout.current[nail.id]) {
                    let progress = 0;
                    const intervalTIme = CUT_TIME / 50;
                    const progressIncrement = 100 / 50;
                    setNailProgress((prev) => ({ ...prev, [nail.id]: progress }));

                    intervalRef.current[nail.id] = setInterval(() => {
                        progress += progressIncrement;
                        setNailProgress((prev) => ({ ...prev, [nail.id]: progress }));
                    }, intervalTIme);

                    trimmerTimeout.current[nail.id] = setTimeout(() => {

                
                        setIsTrimming(true);
                        setTimeout(() => {
                            setIsTrimming(false);
                        }, 200);
                        setNails((prevNails) =>
                            prevNails.map((prevNail) =>
                                prevNail.id === nail.id ? { ...prevNail, isTrimmed: true } : prevNail
                            )
                        );
                        addScore();
                        clearInterval(intervalRef.current[nail.id]!);
                        trimmerTimeout.current[nail.id] = null;
                        setNailProgress((prev) => ({ ...prev, [nail.id]: 100 }));
                    }, CUT_TIME);
                }
            } else {
                if (trimmerTimeout.current[nail.id]) {
                    clearTimeout(trimmerTimeout.current[nail.id]!);
                    clearInterval(intervalRef.current[nail.id]!);
                    trimmerTimeout.current[nail.id] = null;
                    setNailProgress((prev) => ({ ...prev, [nail.id]: 0 }));
                }
            }
        });
    };

    return (
          
        <Animated.View style={ styles.mainBox}>
            
            <PanGestureHandler 
                onGestureEvent={(e) => handleGesture(e)}
                onHandlerStateChange={(e: PanGestureHandlerGestureEvent)=> {
                    if(e.nativeEvent.state == State.END)  trimmer_current_position = trimmer}}
                >
                <Animated.Image
                    source={isTrimming ? closeTrimmer : openTrimmer}
                    style={{
                        ...styles.trimmerImage,
                        zIndex: 4,
                        top: trimmer.y,
                        left: trimmer.x,
                    }}
                    resizeMode="contain"
                />
            </PanGestureHandler>

            <Animated.View style={styles.pawContainer}>

                <Animated.Image
                    source={pawImage}
                    style={styles.paw}
                />
                {nails.map((nail) => (
                    nail && (
                        <Animated.View 
                        key={nail.id} 
                        style={{
                            position: "absolute",
                            width: nailSize,
                            height: nailSize,
                            top: pawSize * nail.position.y,
                            left: pawSize * nail.position.x,

                        }}>
                            <Animated.Image

                                style={{
                                    transform: nail.id == 4 ? [{ rotate: nail.rotation }] : undefined,
                                    width: nailSize,
                                    height: nailSize,
                                    resizeMode: "contain",
                                    
                                }}

                                source={
                                    nail.isTrimmed
                                    ? require("@/assets/images/minigames/nail-trimmer/nail-short.png")
                                    : require("@/assets/images/minigames/nail-trimmer/nail-long.png")
                                }
                            />
                            {nailProgress[nail.id] > 0 && !nail.isTrimmed && (
                                <Svg 
                                    height={nailSize } 
                                    width={nailSize } 
                                    viewBox={`0 0 ${nailSize * 2} ${nailSize * 2}`}
                                    
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        
                                        overflow: "visible",
                                    }}
                                >
                                    <Circle 
                                        cx={nailSize / 2}
                                        cy={nailSize / 2}
                                        r={nailSize / 2 - 2}
                                        stroke="lightblue"
                                        strokeWidth="10"
                                        fill="none"
                                        strokeDasharray={Math.PI * nailSize }
                                        strokeDashoffset={Math.PI * nailSize - (Math.PI * nailSize * nailProgress[nail.id]) / 100}
                                        strokeLinecap="round"
                                    />
                                </Svg>
                            )}
                        </Animated.View>
                    )
                ))}
            </Animated.View>
            
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    trimmerImage: {
        position: "absolute",
        zIndex: 10
    },
    paw: {
        position: "absolute",
        width: pawSize /2,
        height: pawSize /2,
        bottom:0,
        zIndex: 3,
    },
    pawContainer:{
        position: "relative",
        backgroundColor: "#ddd",
        display: "flex",
        alignItems: "center",
        width: pawSize,
        height: pawSize,
    },
    trimmerContainer: {
        zIndex: 10
    },
    mainBox:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        backgroundColor: "blue"
    }
});