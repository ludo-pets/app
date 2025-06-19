import Dialog from '@/components/Dialog/Dialog'
import { StyleSheet } from 'react-native'

export default function StartGameDialog({
    startGame,
}: {
    startGame: (value: boolean) => void
}) {
    return (
        <Dialog.Container>
            <Dialog.Text content="Como Jogar" style={styles.title} />
            <Dialog.Text content="Arraste o cortador para cima das unhas do seu pet para cortá-las" style={styles.subtitle} />
            <Dialog.ButtonArea>
                <Dialog.Button action={() => startGame(true)} text="Começar" />
            </Dialog.ButtonArea>
        </Dialog.Container>
    )
}

const styles = StyleSheet.create({
    dialogCustom: {
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
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 10,
    }
})
