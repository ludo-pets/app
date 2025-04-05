import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import Dialog from "../../Dialog/Dialog";
import Svg, { Image } from "react-native-svg";
import "@/global.css";
const { width, height } = Dimensions.get("window");
export default function EndGameDialog({endGame}: {endGame: (value: boolean) => void}){
    return(
        <Dialog.Container> 
            <Dialog.Icon 
                content={
                    <Svg 
                        width={width/ 3} 
                        height={width / 3} 
                        viewBox={`0 0 ${width / 3} ${width / 3}`}
                        >
                        <Image
                            href={require("@/imagens_svg/trophy.svg")}
                            width="100%"
                            height="100%"

                        />
                    </Svg>
                }
            />
            <Dialog.Text
                content="Parabéns!"
                color="#FBBC05"
                style={{
                    fontweight: "800",
                }}
            />
            <Dialog.Text
            content="Você ganhou 5 moedas."
            />
            <Dialog.ButtonArea>
                <Dialog.Button
                    action={() => endGame(true)}
                    text="Avançar"
                    color="#fff"
                    background="#FFAFD4"
                />
            </Dialog.ButtonArea>
        </Dialog.Container>
    )
}