import Dialog from '@/components/Dialog/Dialog'
import React, { useMemo } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import TrophyIcon from '@/assets/images/minigames/nail-trimmer/trophy.svg'

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
                            <TrophyIcon width={width / 3} height={width / 3} />
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
