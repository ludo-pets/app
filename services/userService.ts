import Pet from '@/dtos/Pet'
import User from '@/dtos/User'
import { db } from '@/firebaseConfig'
import {
    collection,
    doc,
    DocumentData,
    DocumentReference,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore'

export const getUserWithPetByEmailService = async (
    email: string
): Promise<{ user: User; pet: Pet } | null> => {
    try {
        const userData = await getUserDataByEmail(email)
        if (!userData) return null

        const petRef = userData.pet
        if (!petRef) return null

        const petData = await getPetDataById(petRef)
        if (!petData) return null

        const pet: Pet = { ...petData } as Pet

        const user: User = { ...userData } as User

        return { user, pet }
    } catch (error) {
        console.error('Erro ao buscar User e Pet:', error)
        return null
    }
}

export const updateUserService = async (
    userId: string,
    userData: Partial<User>
): Promise<boolean | null> => {
    return await updateUserInFirestore(userId, userData)
}

export const getUserDataByEmail = async (
    email: string
): Promise<DocumentData | null> => {
    if (!isValidEmail(email)) {
        console.error('Formato do e-mail inválido')
        return null
    }

    const userQuery = query(collection(db, 'User'), where('email', '==', email))
    const userSnap = await getDocs(userQuery)

    if (userSnap.empty) {
        console.error('User não encontrado')
        return null
    }

    return userSnap.docs[0].data()
}

const isValidEmail = (email: string): boolean => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)
}

export const getPetDataById = async (
    petRef: DocumentReference<unknown, DocumentData>
) => {
    const petSnap = await getDoc(petRef)

    if (!petSnap.exists()) {
        console.error('Pet não encontrado')
        return null
    }

    return petSnap.data()
}

export const updateUserInFirestore = async (
    userId: string,
    userData: Partial<User>
): Promise<boolean | null> => {
    try {
        const userRef = doc(db, 'User', userId)
        await updateDoc(userRef, { ...userData })
        return true
    } catch (error) {
        console.error('Erro ao atualizar User:', error)
        return null
    }
}
