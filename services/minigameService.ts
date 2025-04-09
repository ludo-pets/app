import Minigame from '@/dtos/Minigame'
import { db } from '@/firebaseConfig'
import {
    getDoc,
    doc,
} from 'firebase/firestore'

export const getMinigameByIdService = async (
    id: string
): Promise<{ minigame: Minigame } | null> => {
    try {
        const minigameRef = doc(db, "Minigame", id);
        const minigameSnap = await getDoc(minigameRef);

        if (!minigameSnap.exists()) {
            console.error('Minigame não encontrado')
            return null
        }

        const minigameData = minigameSnap.data() as Minigame;

        const minigame: Minigame = {
            id: minigameData.id,
            givenMoney: minigameData.givenMoney,
            name: minigameData.name
        }

        return { minigame }
    } catch (error) {
        console.error('Erro ao buscar User e Pet:', error)
        return null
    }
}