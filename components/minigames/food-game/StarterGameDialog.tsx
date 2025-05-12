import Dialog from '@/components/Dialog/Dialog'
import { View, Image, StyleSheet, Dimensions } from 'react-native'

const bolo = require('@/assets/images/minigames/food-game/bolo.png')
const chocolate = require('@/assets/images/minigames/food-game/chocolate.png')
const racao = require('@/assets/images/minigames/food-game/racao.png')
const health = require('@/assets/images/minigames/food-game/heart.png')

const { width, height } = Dimensions.get('window')

export default function StarterGameDialog({
    startGame,
}: {
    startGame: (value: boolean) => void
}) {
    return (
        <Dialog.Container containerStyle={styles.dialogCustom}>
            <View style={styles.headerArea}>
                <Dialog.Text content="Como Jogar" style={styles.title} />
                <Dialog.Text
                    content="Pegue os alimentos corretos para que seu pet se mantenha saudável e feliz!"
                    style={styles.subtitle}
                />
            </View>
            <View style={styles.foodItem}>
                <Image source={racao} style={styles.foodImage} />
                <Dialog.Text
                    content="Ração: +10 pontos"
                    style={styles.foodText}
                />
            </View>
            <View style={styles.foodItem}>
                <Image source={bolo} style={styles.foodImage} />
                <Dialog.Text content="Bolo: -1 vida" style={styles.foodText} />
            </View>
            <View style={styles.foodItem}>
                <Image source={chocolate} style={styles.foodImage} />
                <Dialog.Text
                    content="Chocolate: -1 vida"
                    style={styles.foodText}
                />
            </View>
            <View style={styles.foodItem}>
                <Image source={health} style={styles.foodImage} />
                <Dialog.Text
                    content="Coração: +1 vida"
                    style={styles.foodText}
                />
            </View>
            <Dialog.ButtonArea>
                <Dialog.Button action={() => startGame(true)} text="Começar" />
            </Dialog.ButtonArea>
        </Dialog.Container>
    )
}

const styles = StyleSheet.create({
    dialogCustom: {
        width: width * 0.92,
        minHeight: height * 0.6,
        maxWidth: 440,
        paddingHorizontal: 32,
        paddingTop: 28,
        paddingBottom: 18,
        borderRadius: 32,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    headerArea: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 16,
    },
    foodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#fefefe',
        borderRadius: 14,
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: '100%',
        alignSelf: 'center',
    },
    foodImage: {
        width: 36,
        height: 36,
        marginRight: 10,
    },
    foodText: {
        fontSize: 16,
        flexShrink: 1,
    },
})
