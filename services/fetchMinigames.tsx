import {
    getFirestore,
    collection,
    getDocs,
    QuerySnapshot,
    DocumentData,
} from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import Minigame from '@/dtos/Minigame'

const db = getFirestore(firebaseApp)

/**
 
Fetches all documents from the 'Minigame' collection in Firestore.
@returns {Promise<Minigame[]>} A promise that resolves to an array of quiz questions.
@throws Will throw an error if fetching fails.*/
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