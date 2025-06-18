import Dialog from '@/components/Dialog/Dialog'
import { StyleSheet } from 'react-native'

interface StartGameDialogProps {
    startGame: VoidFunction
}
export default function StartGameDialog({ startGame }: StartGameDialogProps) {
    return (
        <Dialog.Container>
            <Dialog.Text content="Como Jogar" style={styles.title}/>
            <Dialog.Text content="Guie seu aviãozinho pelo céu." style={styles.subtitle}/>
            <Dialog.Text content="Toque na direita para subir" style={styles.gameController}/>
            <Dialog.Text content="Toque na esquerda para descer" style={styles.gameController}/> 
            <Dialog.Text content="Desvie dos obstáculos no caminho!" style={styles.subtitle}/>
            <Dialog.ButtonArea>
                <Dialog.Button action={() => startGame()} text="Começar" />
            </Dialog.ButtonArea>
        </Dialog.Container>
    )}
    
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
    },
    gameController: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 10,
    }
})