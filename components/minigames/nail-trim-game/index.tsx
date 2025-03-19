import { Dimensions, Image, Animated } from "react-native";
import { styles } from "./styles";
import {GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent} from "react-native-gesture-handler"
import { Nail } from './types';
import { useMemo, useRef, useState } from 'react';

const { width, height } = Dimensions.get("window");
const nailsSet: Nail[] = [
    { id: 1, position: { x: 14, y: 73 },rotation: "-100deg", isTrimmed: false },
    { id: 2, position: { x: 18, y: 67 },rotation: "0deg", isTrimmed: false },
    { id: 3, position: { x: 30, y: 65}, rotation: "50deg", isTrimmed: false },
    { id: 4, position: { x: 48, y: 67 }, rotation: "45deg", isTrimmed: false },
] 
const nailSize = width / 6;
const pawSize = width;
export default function NailTrimGame() {
    const [nails, setNails] = useState<Nail[]>(nailsSet)
    const [trimmer, setTrimmer] = useState({ x: 50, y: 0 })

    const trimmerTimeout = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
    const handleGesture = (e: PanGestureHandlerGestureEvent )=> {
        
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

            // Se ainda não tem um timeout ativo pra essa unha, cria um
            if (!trimmerTimeout.current[nail.id]) {
                trimmerTimeout.current[nail.id] = setTimeout(() => {
                    setNails((prevNails) =>
                        prevNails.map((prevNail) =>
                            prevNail.id === nail.id ? { ...prevNail, isTrimmed: true } : prevNail
                        )
                    );
                    trimmerTimeout.current[nail.id] = null;
                }, 2000);
            }
        } else {
            // Se o cortador saiu da unha, cancela o timeout
            if (trimmerTimeout.current[nail.id]) {
                clearTimeout(trimmerTimeout.current[nail.id]!);
                trimmerTimeout.current[nail.id] = null;
                console.log("timeout canceled for nail", nail.id);
            }
        }
    });
        //console.log(e.nativeEvent.translationX, e.nativeEvent.translationY)
    }
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
                {
                    nails.map((nail) => (
                        nail &&
                        <Animated.Image
                            key={nail.id}
                            style={{
                                position: "absolute",
                                width: nailSize,
                                height: nailSize,
                                top: (height * nail.position.y) / 100,
                                left: (width * nail.position.x) / 100,
                                resizeMode: "contain",
                                
                                transform: nail.id == 4 ? [{ rotate: nail.rotation }]: undefined,
                            }}
                            source={
                                nail.isTrimmed ? 
                                require("@/assets/images/minigames/nail-trimmer/nail-short.png") : 
                                require("@/assets/images/minigames/nail-trimmer/nail-long.png")
                            }
                       />
                    ))  
                }
                
                <PanGestureHandler onGestureEvent={(e) => handleGesture(e)}>
                    
                    <Animated.Image
                        
                        id="trimmer"
                        source={require("@/assets/images/minigames/nail-trimmer/trimmer-open.png")}
                        style={{
                            ...styles.trimmerImage,
                            zIndex: 4,
                            top: trimmer.y,
                            left: trimmer.x,
                            borderWidth: 1, // temporário pra debug — vê se tá aparecendo
                            borderColor: "red",

                        }
                        }
                        resizeMode="contain"
                    />
                </PanGestureHandler>
        </GestureHandlerRootView>
    )
}