import { Dimensions, Image, Animated } from "react-native";
import { styles } from "./styles";
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, State } from "react-native-gesture-handler";
import { Nail, NailProgress } from './types';
import { useMemo, useRef, useState } from 'react';
import Svg, { Circle } from "react-native-svg";

const { width, height } = Dimensions.get("window");
const nailsSet: Nail[] = [
    { id: 1, position: { x: 14, y: 73 }, rotation: "0deg", isTrimmed: false },
    { id: 2, position: { x: 18, y: 67 }, rotation: "0deg", isTrimmed: false },
    { id: 3, position: { x: 30, y: 65 }, rotation: "50deg", isTrimmed: false },
    { id: 4, position: { x: 48, y: 67 }, rotation: "45deg", isTrimmed: false },
];
const trimmer_initial_position = { x: 0, y: 0 };
const nailSize = width / 6;
const pawSize = width;

const CUT_TIME = 1000;


export default function NailTrimGame() {
    const [nails, setNails] = useState<Nail[]>(nailsSet);
    const [trimmer, setTrimmer] = useState(trimmer_initial_position);
    const [nailProgress, setNailProgress] = useState<NailProgress>({});

    
    const trimmerTimeout = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
    const intervalRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({});

    const handleGesture = (e: PanGestureHandlerGestureEvent) => {
        setTrimmer({ x: e.nativeEvent.translationX, y: e.nativeEvent.translationY });

        nails.forEach((nail) => {
            if (nail.isTrimmed) return;

            const nailX = (width * nail.position.x) / 100;
            const nailY = (height * nail.position.y) / 100;
            const nailCenterX = nailX + nailSize / 2;
            const nailCenterY = nailY + nailSize / 2;
            const trimmerCenterX = e.nativeEvent.translationX + nailSize / 2;
            const trimmerCenterY = e.nativeEvent.translationY + nailSize / 2;
            const distance = Math.sqrt(
                (nailCenterX - trimmerCenterX) ** 2 + (nailCenterY - trimmerCenterY) ** 2
            );

            if (distance < nailSize / 2) {
                console.log("trimming nail", nail.id);

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
                    console.log("timeout canceled for nail", nail.id);
                }
            }
        });
    };

    return (
        <GestureHandlerRootView
            style={{
                backgroundColor: "#fff",
                boxSizing: "content-box",
                height: "100%",
                width: width,
                padding: 0,
                margin: 0,
                position: "relative",
            }}
        >
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
                                height={nailSize * 1.5} 
                                width={nailSize * 1.5} 
                                viewBox={`0 0 ${nailSize * 1.5} ${nailSize * 1.5}`}
                                style={{
                                    position: "absolute",
                                    top: (height * nail.position.y) / 100 * 0.85,
                                    left: (width * nail.position.x) / 100* 0.95
                                }}>
                                <Circle 
                                    cx={nailSize * 1.5 / 2}
                                    cy={nailSize* 1.5 / 2}
                                    r={nailSize * 1.5 / 2 - 2}
                                    stroke="lightblue"
                                    strokeWidth="10"
                                    fill="none"
                                    strokeDasharray={Math.PI * nailSize * 1.5}
                                    strokeDashoffset={Math.PI * nailSize * 1.5- (Math.PI * nailSize * 1.5 * nailProgress[nail.id]) / 100}
                                    strokeLinecap="round"/>
                            </Svg>
                        )}
                    </Animated.View>
                )
            ))}
            <PanGestureHandler 
                onGestureEvent={(e) => handleGesture(e)}
                onHandlerStateChange={(e: PanGestureHandlerGestureEvent)=> e.nativeEvent.state == State.END && setTrimmer(trimmer_initial_position)}
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
        </GestureHandlerRootView>
    );
}
