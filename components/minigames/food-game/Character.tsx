import { View, ViewStyle, Image, StyleSheet } from "react-native";
import { useGameConfig } from "./GameConfig";
import { useMemo } from "react";

interface CharacterProps {
    playerImage: any;
    characterPosition: number;
}

export const useCharacter = ({ playerImage, characterPosition }: CharacterProps) => {
    const { config } = useGameConfig();

    const characterStyle: ViewStyle = {
        position: "absolute",
        bottom: 20,
        width: config.CHARACTER_WIDTH,
        height: config.CHARACTER_HEIGHT,
        left: characterPosition,
    };


    const Item = useMemo(() => {
        return (
            <View style={[characterStyle, { left: characterPosition }]}>
                <Image
                    source={playerImage}
                    style={styles.characterImage}
                    resizeMode="contain"
                />
            </View>

        );
    }, [characterPosition]);

    return { Item };
};

const styles = StyleSheet.create({
    characterImage: {
        width: "100%",
        height: "100%",
    },
});