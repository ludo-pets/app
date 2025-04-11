import Lesson from '@/dtos/Lesson'
import { db } from '@/firebaseConfig'
import { getDoc, doc, collection, getDocs } from 'firebase/firestore'

export const getLessonByIdService = async (
    id: string
): Promise<{ lesson: Lesson } | null> => {
    try {
        const lessonRef = doc(db, 'Lesson', id)
        const lessonSnap = await getDoc(lessonRef)

        if (!lessonSnap.exists()) {
            console.error('Lição não encontrada')
            return null
        }

        const lessonData = lessonSnap.data() as Lesson

        const lesson: Lesson = {
            id: lessonData.id,
            concluded: lessonData.concluded,
            name: lessonData.name,
            questions: lessonData.questions,
            givenExperience: lessonData.givenExperience,
            givenMoney: lessonData.givenMoney
        }

        return { lesson }
    } catch (error) {
        console.error('Erro ao buscar Lesson:', error)
        return null
    }
}

export const getAllLessons = async (): Promise<{ lessons: Array<Lesson> } | null> => {
    try {
        const lessonRef = collection(db, 'Lesson')
        const lessonSnap = await getDocs(lessonRef)
    
        const lessons: Array<Lesson> = lessonSnap.docs.map(doc => ({
            ...doc.data()
        })) as Lesson[]

        console.log(lessons)

        return { lessons }
    } catch (error) {
        console.error('Erro ao buscar Lessons:', error)
        return null
    }
}
