import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
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

export const fetchQuestionById = async(questionId: string): Promise<Question> => {
    try {
        const questionDocRef = doc(db, 'Question', questionId)
        const questionSnapshot = await getDoc(questionDocRef)

        if (questionSnapshot.exists()) {
            const data = questionSnapshot.data()
            return {
                id: questionSnapshot.id,
                answers: data.answers || [],
                description: data.description || 'No description',
                explanation: data.explanation || 'No explanation',
                // image: data.image,
                rightAnswer: data.rightAnswer,
                title: data.title || 'Untitled Question',
            } as Question
        } else {
            throw new Error(`Question with ID ${questionId} does not exist.`)
        }
    } catch (error) {
        console.log('Error fetching question:', error)
        throw new Error('Failed to fetch the question.')
    }
}
