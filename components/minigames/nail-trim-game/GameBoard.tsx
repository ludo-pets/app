import { Dimensions, Image, Animated } from "react-native";
import { styles } from "./styles";
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, State } from "react-native-gesture-handler";
import { Nail, NailProgress } from './types';
import { useMemo, useRef, useState } from 'react';
import Svg, { Circle } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const nailsSet: Nail[] = [
    { id: 1, position: { x: 15, y: 74 }, rotation: "90deg", isTrimmed: false },
    { id: 2, position: { x: 20, y: 68 }, rotation: "0deg", isTrimmed: false },
    { id: 3, position: { x: 29, y: 66 }, rotation: "50deg", isTrimmed: false },
    { id: 4, position: { x: 49, y: 69}, rotation: "45deg", isTrimmed: false },
];
const trimmer_initial_position = { x: width /4, y: height /6 };
let trimmer_current_position = { x: 0, y: 0 };
const nailSize = width / 6;
const pawSize = width;

const CUT_TIME = 1000;


export default function GameBoard() {
    const [nails, setNails] = useState<Nail[]>(nailsSet);
    const [trimmer, setTrimmer] = useState(trimmer_initial_position);
    const [nailProgress, setNailProgress] = useState<NailProgress>({});

    
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
                        setNails((prevNails) =>
                            prevNails.map((prevNail) =>
                                prevNail.id === nail.id ? { ...prevNail, isTrimmed: true } : prevNail
                            )
                        );
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
                source={require("@/assets/images/minigames/nail-trimmer/paw.png")}
                style={{
                    position: "absolute",
                    width: pawSize,
                    height: pawSize,
                    bottom: -pawSize / 5,
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
                    source={require("@/assets/images/minigames/nail-trimmer/trimmer-open.png")}
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
