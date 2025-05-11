import Dialog from '@/components/Dialog/Dialog'
import React, { useMemo } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import TrophyIcon from '@/assets/images/minigames/nail-trimmer/trophy.svg'

const { width } = Dimensions.get('window')

interface EndGameDialogProps {
    score: number
    coins: number
    callback: () => void
    message?: string
}

const messagesToShow = [
    'Lembre-se: alimento humano pode intoxicar seu pet.',
    'Atenção: pets precisam de ração balanceada.',
    'Importante: restos de comida podem causam problemas digestivos.',
    'Lembre-se: doces fazem mal ao fígado dos pets.',
    'Cuidado: temperos e sal afetam a saúde animal.',
    'Atenção: cebola e alho são tóxicos para pets.',
    'É essencial: ração tem os nutrientes certos pro pet.',
    'Importante: alimentação correta evita doenças para seu pet',
    'Atenção: seu pet vive mais saudável com alimentação correta.',
]

export default function EndGameDialog({
    score,
    coins,
    callback,
    message,
}: EndGameDialogProps) {
    const randomMessage = useMemo(() => {
        const index = Math.floor(Math.random() * messagesToShow.length)
        return messagesToShow[index]
    }, [])

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
                        content={`Você fez ${score} pontos.`}
                    />
                    <Dialog.Text
                        style={styles.dialogCustomPointsText}
                        content={`Você ganhou ${coins} moedas.`}
                    />
                </View>

                {message ? (
                    <Dialog.Text
                        content={message}
                        style={{
                            fontSize: 16,
                            textAlign: 'center',
                            marginBottom: 4,
                        }}
                    />
                ) : (
                    <Dialog.Text
                        content={randomMessage}
                        style={{
                            fontSize: 16,
                            textAlign: 'center',
                            marginBottom: 4,
                        }}
                    />
                )}

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
