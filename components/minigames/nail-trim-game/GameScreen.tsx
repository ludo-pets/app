import { Image, View } from 'react-native';
import { styles } from './styles';
import { Nail } from './types';
import { useState } from 'react';

const nailsSet: Nail[] = [
    { id: 1, position: { x: 100, y: 100 }, isTrimmed: false },
    { id: 2, position: { x: 200, y: 200 }, isTrimmed: false },
    { id: 3, position: { x: 300, y: 300 }, isTrimmed: false },
    { id: 4, position: { x: 400, y: 400 }, isTrimmed: false },
] 
export default function GameScreen() {
    const [nails, setNails] = useState<Nail[]>(nailsSet)
    return (
        <View style={styles.gameContainer}>
            <Image 
                source={require("@/assets/images/minigames/nail-trimmer/paw.png")}
                style={styles.pawImage}

            />
            {
                nails.map((nail) => (
                    <Image
                        key={nail.id}
                        style={{
                            ...styles.nail,

                            
                        }}
                        source={
                            nail.isTrimmed ? 
                            require("@/assets/images/minigames/nail-trimmer/nail-short.png") : 
                            require("@/assets/images/minigames/nail-trimmer/nail-long.png")
                        }
                       />
                ))
            }
        </View>
    );
}