import Dialog from '@/components/Dialog/Dialog'

interface StartGameDialogProps {
    startGame: VoidFunction
}
export default function StartGameDialog({ startGame }: StartGameDialogProps) {
    return (
        <Dialog.Container>
            <Dialog.Text content="Segura firme! Direita sobe, esquerda desce. Bora desviar e voar longe!" />
            <Dialog.ButtonArea>
                <Dialog.Button action={() => startGame()} text="Começar" />
            </Dialog.ButtonArea>
        </Dialog.Container>
    )
}
