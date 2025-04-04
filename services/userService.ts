import { IPet } from "@/dtos/IPet";
import { IUser } from "@/dtos/IUser"
import { db } from "@/firebaseConfig"
import { doc, getDoc, updateDoc } from "firebase/firestore"


export const getUserWithPetByIdService = async (
    userId: string
): Promise<{ user: IUser; pet: IPet } | null> => {
    try {
        const userRef = doc(db, 'User', userId)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
            console.error('User não encontrado')
            return null
        }

        const userData = userSnap.data() // Referência ao pet
        const petSnap = await getDoc(userData.pet)

        if (!petSnap.exists()) {
            console.error('Pet não encontrado')
            return null
        }

        const petData: IPet = petSnap.data() as IPet

        const user: IUser = {
            id: userSnap.id,
            email: userData.email,
            money: userData.money,
            level: userData.level,
            experience: userData.experience,
            notifications: userData.notifications,
        }

        return { user, pet: petData }
    } catch (error) {
        console.error('Erro ao buscar User e Pet:', error)
        return null
    }
}

export const updateUserService = async (
    userId: string,
    userData: Partial<IUser>
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
