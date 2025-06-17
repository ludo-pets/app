import {
    getFirestore,
    collection,
    getDocs,
    QuerySnapshot,
    DocumentData,
} from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import Question from '@/dtos/Question'

const db = getFirestore(firebaseApp)

/**
 * Fetches all documents from the 'Question' collection in Firestore.
 * @returns {Promise<Question[]>} A promise that resolves to an array of quiz questions.
 * @throws Will throw an error if fetching fails.
 */
export const fetchAllQuestions = async (): Promise<Question[]> => {
    try {
        const questionsCollectionRef = collection(db, 'Question')
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
            questionsCollectionRef
        )

        const questions: Question[] = []
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            questions.push({
                id: doc.id,
                answers: data.answers || [],
                description: data.description || 'No description',
                explanation: data.explanation || 'No explanation',
                // image: data.image,
                rightAnswer: data.rightAnswer,
                title: data.title || 'Untitled Question',
            } as Question)
        })
        return questions
    } catch (error) {
        throw new Error('Failed to fetch quiz questions.')
    }
}
