import { Dimensions } from 'react-native'
import Dialog from '@/components/Dialog/Dialog'
const { width } = Dimensions.get('window')
import TrophyIcon from '@/assets/images/minigames/nail-trimmer/trophy.svg'

export default function EndGameDialog({
    endGame,
}: {
    endGame: () => void
}) {
    return (
        <Dialog.Container>
            <Dialog.Icon
                content={<TrophyIcon width={width / 3} height={width / 3} />}
            />
            <Dialog.Text
                content="Parabéns!"
                color="#FBBC05"
                style={{
                    fontweight: '800',
                }}
            />
            <Dialog.Text content="Você ganhou 5 moedas." />
            <Dialog.ButtonArea>
                <Dialog.Button
                    action={() => endGame()}
                    text="Avançar"
                    color="#fff"
                    background="#FFAFD4"
                />
            </Dialog.ButtonArea>
        </Dialog.Container>
    )
}
