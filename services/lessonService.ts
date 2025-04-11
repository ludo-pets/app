import Lesson from '@/dtos/Lesson'
import Minigame from '@/dtos/Minigame'
import { db } from '@/firebaseConfig'
import { getDoc, doc } from 'firebase/firestore'

export const getAllLessons = async (
    id: string
): Promise<{ minigame: Array<Lesson> } | null> => {
    try {
        const lessonSnap = await db.collection('Lesson').get()

        if (!minigameSnap.exists()) {
            console.error('Minigame não encontrado')
            return null
        }

        const lessonsData = lessonSnap.docs.map(doc => doc.data() as Lesson());

        const minigame: Minigame = {
            id: minigameData.id,
            givenMoney: minigameData.givenMoney,
            name: minigameData.name,
        }

        return { minigame }
    } catch (error) {
        console.error('Erro ao buscar User e Pet:', error)
        return null
    }
}
