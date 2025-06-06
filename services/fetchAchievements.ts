import {
    getFirestore,
    collection,
    getDocs,
    QuerySnapshot,
    DocumentData,
} from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import Achievement from '@/dtos/Achievement'

const db = getFirestore(firebaseApp)

/**
Fetches all documents from the 'Achievements' collection in Firestore.
@returns {Promise<Achievement[]>} 
@throws Will throw an error if fetching fails.
*/
export const fetchAchievements = async (): Promise<Achievement[]> => {
    try {
        const achievementsCollectionRef = collection(db, 'Achievements')
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
            achievementsCollectionRef
        )

        const achievements: Achievement[] = []
        querySnapshot.forEach((doc) => {
            const data: Achievement = doc.data() as Achievement
            achievements.push({
                id: data.id,
                name: data.name,
                message: data.message
            } as Achievement)
        })
        return achievements
    } catch (error) {
        throw new Error('Failed to fetch achievements.')
    }
}