import Pet from '@/dtos/Pet'
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
    DocumentData,
    DocumentReference,
} from 'firebase/firestore'

const getUserDataByEmail = async(
    email: string
): Promise<DocumentData | null> => {
    if (!email.match("/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g")) {
        console.error('Formato do e-mail inválido')
        return null;
    }

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
    return userDoc.data();
}

const getPetDataById = async(
    pet: DocumentReference<unknown, DocumentData>
): Promise<DocumentData | null> => {
    const petSnap = await getDoc(pet);

    if (!petSnap.exists()) {
        console.error('Pet não encontrado')
        return null
    }

    return petSnap;
}

export const getUserWithPetByEmailService = async (
    email: string
): Promise<{ user: User; pet: Pet } | null> => {
    try {
        const userData = await getUserDataByEmail(email);
        if (userData == null)
            return null;

        const petSnap = await getPetDataById(userData.pet);
        if (petSnap == null)
            return null;

        const petData = petSnap.data() as Pet;

        const pet: Pet = {
            id: petSnap.id,
            name: petData.name,
            color: petData.color,
            type: petData.type,
            purchasedItems: petData.purchasedItems,
            activeItems: petData.activeItems,
            wellBeing: {
                clean: new Date(petData.wellBeing.clean),
                fun: new Date(petData.wellBeing.fun),
                hunger: new Date(petData.wellBeing.hunger),
                thirst: new Date(petData.wellBeing.thirst),
                sleep: new Date(petData.wellBeing.sleep),
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
