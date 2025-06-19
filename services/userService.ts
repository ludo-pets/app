import { Pet } from '@/dtos/Pet'
import User from '@/dtos/User'
import { db } from '@/firebaseConfig'
import {
    collection,
    doc,
    DocumentData,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore'
import { getPetDataById } from './petService'

/**
 * Fetches a User document and its associated Pet document from Firestore by the user's email.
 * @param email - The email address of the user to fetch.
 * @returns An object containing the User and Pet documents, or null if not found.
 */
export const getUserWithPetByEmail = async (
    email: string
): Promise<{ user: User; pet: Pet } | null> => {
    try {
        const userData = await getUserDataByEmail(email)
        if (!userData) return null

        const petReference = userData.pet
        if (!petReference) return null
        
        const petData = await getPetDataById(petReference)
        if (!petData) return null

        const pet: Pet = { ...petData } as Pet

        const user: User = { ...userData } as User

        return { user, pet }
    } catch (error) {
        console.error('Erro ao buscar User e Pet:', error)
        return null
    }
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

export const createUser = async (
    params: { id: string; email: string; newPetId: string}
): Promise<User | null> => {
    const { id, email, newPetId} = params
    const userRef = doc(db, 'User', id)

    const newUser: User = {
        id,
        email,
        pet: newPetId,
        achievements: [],
        experience: 0,
        level: 1,
        money: 0,
        lastLessonConcluded: null,
        notifications: true
    } as User

    try {
        await setDoc(userRef, newUser)
        return newUser
    } catch (err) {
        console.error('createUser: Firestore write failed ->', err)
        return null
    }
}

export const updateUser = async (
    userId: string,
    userData: Partial<User>
): Promise<boolean> => {
    if (!userId || Object.keys(userData).length === 0) return false

    try {
        const userReference = doc(db, 'User', userId)
        await updateDoc(userReference, { ...userData })
    } catch (error) {
        console.error('Erro ao atualizar User:', error)
        return false
    }

    return true
}
