import Minigame from '@/dtos/Minigame'
import { firebaseApp } from '@/firebaseConfig'
import {
    getDoc,
    doc,
    getFirestore,
    collection,
    DocumentData,
    QuerySnapshot,
    getDocs,
} from 'firebase/firestore'

export const getMinigameByIdService = async (
    id: string
): Promise<{ minigame: Minigame } | null> => {
    try {
        const minigameRef = doc(db, 'Minigame', id)
        const minigameSnap = await getDoc(minigameRef)

        if (!minigameSnap.exists()) {
            console.error('Minigame não encontrado')
            return null
        }

        const minigameData = minigameSnap.data() as Minigame

        const minigame: Minigame = {
            id: minigameData.id,
            givenMoney: minigameData.givenMoney,
            name: minigameData.name,
            image: '',
            description: '',
        }

        return { minigame }
    } catch (error) {
        console.error('Erro ao buscar minigame:', error)
        return null
    }
}

const db = getFirestore(firebaseApp)

/**
Fetches all documents from the 'Minigame' collection in Firestore.
@returns {Promise<Minigame[]>} A promise that resolves to an array of quiz questions.
@throws Will throw an error if fetching fails.
*/
export const fetchMinigames = async (): Promise<Minigame[]> => {
    try {
        const minigamesCollectionRef = collection(db, 'Minigame')
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
            minigamesCollectionRef
        )

        const minigames: Minigame[] = []
        querySnapshot.forEach((doc) => {
            const data: Minigame = doc.data() as Minigame
            minigames.push({
                id: data.id,
                name: data.name,
                image: data.image,
                description: data.description || 'No description',
            } as Minigame)
        })
        return minigames
    } catch (error) {
        throw new Error('Failed to fetch quiz questions.')
    }
}
