import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const GRID_SIZE = 4;
const IMAGE_SRC = require('../../../assets/images/jigsawimages/gato.jpeg');
const SCREEN_WIDTH = Dimensions.get('window').width;
const PIECE_SIZE = SCREEN_WIDTH / GRID_SIZE;

type Piece = {
  id: number;
  row: number;
  col: number;
};

export default function JigsawPuzzleGame() {
    const [pieces, setPieces] = useState<Piece[]>([]);
    const [selected, setSelected] = useState<number | null>(null);

    useEffect(() => {
        const shuffled: Piece[] = [];
        for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            shuffled.push({ id: row * GRID_SIZE + col, row, col });
        }
    }

    setPieces(shuffled.sort(() => Math.random() - 0.5));
  }, []);

    const checkWin = (piecesToCheck: Piece[]) => {
        return piecesToCheck.every((piece, index) => {
            const correctId = piece.row * GRID_SIZE + piece.col;
            return piece.id === correctId;
        });
    };

    const handlePress = (index: number) => {
        if (selected === null) {
            setSelected(index);
        } else {
            const newPieces = [...pieces];
            const temp = newPieces[selected];
            newPieces[selected] = newPieces[index];
            newPieces[index] = temp;
            setPieces(newPieces);
            setSelected(null);

            if (checkWin(newPieces)) {
                Alert.alert('🎉 You did it!', 'Puzzle completed!');
                console.log("You Won")
            }
        }
    };

    return (
        <View style={styles.container}>
        {pieces.map((piece, index) => (
            <TouchableOpacity
            key={index}
            onPress={() => handlePress(index)}
            activeOpacity={0.9}
            style={{
                position: 'absolute',
                width: PIECE_SIZE,
                height: PIECE_SIZE,
                left: (index % GRID_SIZE) * PIECE_SIZE,
                top: Math.floor(index / GRID_SIZE) * PIECE_SIZE,
                overflow: 'hidden',
                borderWidth: selected === index ? 2 : 0,
                borderColor: 'red',
            }}
            >
            <Image
                source={IMAGE_SRC}
                style={{
                width: SCREEN_WIDTH,
                height: SCREEN_WIDTH,
                position: 'absolute',
                left: -piece.col * PIECE_SIZE,
                top: -piece.row * PIECE_SIZE,
                }}
            />
            </TouchableOpacity>
        ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH,
        position: 'relative',
        backgroundColor: '#ddd',
    },
});
