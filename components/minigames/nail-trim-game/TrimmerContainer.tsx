import { Image, View } from "react-native";
import { styles } from "./styles";

export default function TrimmerContainer() {
    return (
        <View style={styles.TrimmerContainer}>
            <Image
                source={require("@/assets/images/minigames/nail-trimmer/trimmer-open.png")}
                style={styles.trimmerImage}
            />
        </View>
    );
}