import { IUser } from "@/dtos/IUser"
import { db } from "@/firebaseConfig"
import { doc, getDoc, updateDoc } from "firebase/firestore"


export const getUserByIdService = async (
    userId: string
): Promise<IUser | null> => {
    try {
        const userRef = doc(db, 'User', userId)
        const userSnap = await getDoc(userRef)
        
        console.log('userSnap', userSnap)
        
        if (!userSnap.exists()) {
            console.error('User não encontrado')
            return null
        }

        if (userSnap.exists()) {
            const data = userSnap.data()
            const userData: IUser = {
                id: userId,
                email: data.email,
                money: data.money,
                level: data.level,
                experience: data.experience,
                notifications: data.notifications || '',
            }
            return userData
        } else {
            return null
        }
    } catch (error) {
        console.error('Erro ao buscar User:', error)
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
