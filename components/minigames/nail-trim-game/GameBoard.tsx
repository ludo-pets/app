import { Dimensions, Image, Animated, ImageSourcePropType } from "react-native";
import { styles } from "./styles";
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, State } from "react-native-gesture-handler";
import { Nail, NailProgress } from './types';
import { useMemo, useRef, useState } from 'react';
import Svg, { Circle } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

//trimmer
const trimmer_initial_position = { x: width /4, y: height /6 };
let trimmer_current_position = trimmer_initial_position;
const openTrimmer = require("@/assets/images/minigames/nail-trimmer/trimmer-open.png");
const closeTrimmer = require("@/assets/images/minigames/nail-trimmer/trimmer-closed.png");
const trimmerSound = require("@/assets/images/minigames/nail-trimmer/trimmer-sound.mp3");
//paw


const nailSize = width / 6;
const pawSize = width;

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

            const nailX = (width * nail.position.x) / 100;
            const nailY = (height * nail.position.y) / 100;
            const nailCenterX = nailX + nailSize / 2;
            const nailCenterY = nailY + nailSize / 2;
            const trimmerCenterX = e.nativeEvent.translationX + trimmer_current_position.x + nailSize / 2;
            const trimmerCenterY = e.nativeEvent.translationY + trimmer_current_position.y +nailSize / 2;
            const distance = Math.sqrt(
                (nailCenterX - trimmerCenterX) ** 2 + (nailCenterY - trimmerCenterY) ** 2
            );

            if (distance < nailSize / 2) {
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
                        // when cut is done
                        new Audio(trimmerSound).play();
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
          
        <>
            <Animated.Image
                source={pawImage}
                style={{
                    position: "absolute",
                    width: pawSize,
                    height: pawSize,
                    bottom: -height / 10,
                    zIndex: 3,
                }}
            />
            {nails.map((nail) => (
                nail && (
                    <Animated.View key={nail.id} style={{ position: "absolute" }}>
                        <Animated.Image

                            style={{
                                position: "absolute",
                                width: nailSize,
                                height: nailSize,
                                top: (height * nail.position.y) / 100,
                                left: (width * nail.position.x) / 100,
                                resizeMode: "contain",
                                transform: nail.id == 4 ? [{ rotate: nail.rotation }] : undefined,
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
                                    top: (height * nail.position.y) / 100 * 0.95,
                                    left: (width * nail.position.x) / 100,
                                    overflow: "visible",
                                }}>
                                <Circle 
                                    cx={nailSize / 2}
                                    cy={nailSize / 2}
                                    r={nailSize / 2 - 2}
                                    stroke="lightblue"
                                    strokeWidth="10"
                                    fill="none"
                                    strokeDasharray={Math.PI * nailSize }
                                    strokeDashoffset={Math.PI * nailSize - (Math.PI * nailSize * nailProgress[nail.id]) / 100}
                                    strokeLinecap="round"/>
                            </Svg>
                        )}
                    </Animated.View>
                )
            ))}
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
        </>
    );
}
