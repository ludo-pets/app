import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import Question from '@/dtos/Question'

export const fetchAllQuestionsService = async (): Promise<{
    questions: Question[]
} | null> => {
    try {
        const questionsCollectionRef = collection(db, 'Question')
        const questionsSnapshot = await getDocs(questionsCollectionRef)

        const questions: Question[] = questionsSnapshot.docs.map((doc) => {
            const data = doc.data()
            return {
                id: doc.id,
                answers: data.answers || [],
                description: data.description || 'No description',
                explanation: data.explanation || 'No explanation',
                // image: data.image,
                rightAnswer: data.rightAnswer,
                title: data.title || 'Untitled Question',
            } as Question
        })
        return { questions }
    } catch (error) {
        throw new Error('Failed to fetch quiz questions.')
    }
}
