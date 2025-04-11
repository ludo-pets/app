import Dialog from '@/components/Dialog/Dialog'

export default function StartGameDialog({
    startGame,
}: {
    startGame: (value: boolean) => void
}) {
    return (
        <Dialog.Container>
            <Dialog.Text content="Arraste o cortador para cima das unhas do seu pet para cortá-las" />
            <Dialog.ButtonArea>
                <Dialog.Button action={() => startGame(true)} text="Começar" />
            </Dialog.ButtonArea>
        </Dialog.Container>
    )
}
