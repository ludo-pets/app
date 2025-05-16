import { Pet } from '@/dtos/Pet'
import User from '@/dtos/User'
import { db } from '@/firebaseConfig'
import {
    doc,
    getDoc,
    getDocs,
    updateDoc,
    collection,
    query,
    where,
} from 'firebase/firestore'

export const getUserWithPetByIdService = async (
    email: string
): Promise<{ user: User; pet: Pet } | null> => {
    try {
        const userQuery = query(
            collection(db, 'User'),
            where('email', '==', email)
        )
        const userSnap = await getDocs(userQuery)

        if (userSnap.empty) {
            console.error('User não encontrado')
            return null
        }

        const userDoc = userSnap.docs[0]
        const userData = userDoc.data()

        const petSnap = await getDoc(userData.pet)

        if (!petSnap.exists()) {
            console.error('Pet não encontrado')
            return null
        }

        const petData = petSnap.data() as Pet

        const pet: Pet = {
            id: petSnap.id,
            name: petData.name,
            color: petData.color,
            type: petData.type,
            purchasedItems: petData.purchasedItems,
            activeItems: petData.activeItems,
            wellBeing: {
                clean: petData.wellBeing.clean,
                fun: petData.wellBeing.fun,
                hunger: petData.wellBeing.hunger,
                thirst: petData.wellBeing.thirst,
                sleep: petData.wellBeing.sleep,
            },
        }

        const user: User = {
            id: userData.id,
            email: userData.email,
            money: userData.money,
            level: userData.level,
            experience: userData.experience,
            lastLessonConcluded: userData.lastLessonConcluded,
            notifications: userData.notifications,
            pet: userData.pet,
            achievements: userData.achievements || []
        }

        return { user, pet }
    } catch (error) {
        console.error('Erro ao buscar User e Pet:', error)
        return null
    }
}

export const updateUserService = async (
    userId: string,
    userData: Partial<User>
) => {
    try {
        const userRef = doc(db, 'User', userId)
        await updateDoc(userRef, { ...userData })
        return true
    } catch (error) {
        console.error('Erro ao atualizar User:', error)
        return null
    }
}
