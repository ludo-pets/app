import Lesson from '@/dtos/Lesson'
import { db } from '@/firebaseConfig'
import { getDoc, doc, collection, getDocs, updateDoc } from 'firebase/firestore'

export const getLessonByIdService = async (
    id: string
): Promise<{ lesson: Lesson } | null> => {
    try {
        const lessonRef = doc(db, 'Lesson', id)
        const lessonSnap = await getDoc(lessonRef)

        if (!lessonSnap.exists()) {
            console.log('Lição não encontrada')
            return null
        }

        const lessonData = lessonSnap.data() as Lesson

        const lesson: Lesson = { ...lessonData }

        return { lesson }
    } catch (error) {
        console.log('Erro ao buscar Lição por id:', error)
        return null
    }
}

export const getAllLessonsService = async (): Promise<{
    lessons: Lesson[]
} | null> => {
    try {
        const lessonRef = collection(db, 'Lesson')
        const lessonSnap = await getDocs(lessonRef)

        const lessons: Lesson[] = lessonSnap.docs.map((doc) => ({
            ...doc.data(),
        })) as Lesson[]

        return { lessons: lessons.sort((a, b) => a.order - b.order) }
    } catch (error) {
        console.log('Erro ao buscar Lições:', error)
        return null
    }
}

export const markLessonAsConcluded = async (
    lessonId: string
): Promise<boolean> => {
    if (!lessonId) return false

    try {
        const lessonRef = doc(db, 'Lesson', lessonId)
        await updateDoc(lessonRef, { concluded: true })
    } catch (error) {
        console.log('Erro ao atualizar lição:', error)
        return false
    }
    return true
}
