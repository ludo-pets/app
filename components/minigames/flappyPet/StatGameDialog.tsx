import Dialog from '@/components/Dialog/Dialog'

interface StartGameDialogProps {
    startGame: VoidFunction
}
export default function StartGameDialog({ startGame }: StartGameDialogProps) {
    return (
        <Dialog.Container>
            <Dialog.Text content="Guie seu aviãozinho pelo céu tocando na direita pra subir e na esquerda pra descer. Desvie dos obstáculos no caminho. A cada 5 obstáculos, você ganha uma moedinha!" />
            <Dialog.ButtonArea>
                <Dialog.Button action={() => startGame()} text="Começar" />
            </Dialog.ButtonArea>
        </Dialog.Container>
    )
}
