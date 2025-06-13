import Dialog from '@/components/Dialog/Dialog'
import React from 'react'
import { View, StyleSheet, Dimensions, Image } from 'react-native'

const { width } = Dimensions.get('window')

interface EndGameDialogProps {
    score: number
    coins: number
    callback: VoidFunction
    message?: string
}

export default function EndGameDialog({
    score,
    coins,
    callback,
}: EndGameDialogProps) {
    return (
        <>
            <Dialog.Container containerStyle={{ paddingVertical: 12 }}>
                <View style={styles.dialogCustomHTop}>
                    <Dialog.Icon
                        content={
                            <Image
                                source={{
                                    uri: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/minigames/nail-trimmer/trophy.png',
                                }}
                                style={{ width: width / 3, height: width / 3 }}
                                resizeMode="contain"
                            />
                        }
                    />

                    <Dialog.Text
                        content="Parabéns!"
                        color="#FBBC05"
                        style={{ fontWeight: '800' }}
                    />
                </View>

                <View style={styles.dialogCustomPoints}>
                    <Dialog.Text
                        style={styles.dialogCustomPointsText}
                        content={`Você fez ${score} pontos`}
                    />
                    <Dialog.Text
                        style={styles.dialogCustomPointsText}
                        content={`e ganhou ${coins} moedas.`}
                    />
                </View>

                <Dialog.ButtonArea>
                    <Dialog.Button
                        action={callback}
                        text="Avançar"
                        color="#fff"
                        background="#FFAFD4"
                    />
                </Dialog.ButtonArea>
            </Dialog.Container>
        </>
    )
}

const styles = StyleSheet.create({
    dialogCustomHTop: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    dialogCustomPoints: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    dialogCustomPointsText: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 4,
    },
})
