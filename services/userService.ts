import { IPet } from "@/dtos/IPet";
import { IUser } from "@/dtos/IUser"
import Pet from "@/dtos/Pet";
import User from "@/dtos/User";
import { db } from "@/firebaseConfig"
import { doc, getDoc, updateDoc } from "firebase/firestore"


export const getUserWithPetByIdService = async (
    userId: string
): Promise<{ user: User; pet: Pet } | null> => {
    try {
        const userRef = doc(db, 'User', userId)
        const userSnap = await getDoc(userRef)
        console.log('user: ', userRef)

        if (!userSnap.exists()) {
            console.error('User não encontrado')
            return null
        }

        const userData = userSnap.data() // Referência ao pet\
        
        //const petRef = doc(db, 'Pet', userData.pet)
        
        const petSnap = await getDoc(userData.pet);

        //const petSnap = await getDoc(petRef);
        if (!petSnap.exists()) {
        console.error('Pet não encontrado');
        return null;
        }

        const petData = petSnap.data() as any;


        //const petData = petSnap.data()
        console.log('Date format: ', petData.well_being.clean)
        
        const pet: Pet = {
            id:petSnap.id,
            name:petData.name,
            color: petData.color,
            type: petData.type,
            purchasedItems: petData.purchased_items,
            activeItems: petData.active_items,
            wellBeing: {
                clean: new Date(petData.well_being.clean),
                fun: new Date(petData.well_being.fun),
                hunger: new Date(petData.well_being.hunger),
                thirst: new Date(petData.well_being.thirst),
                sleep: new Date(petData.well_being.sleep)
            }
        }

        const user: User = {
            email: userData.email,
            money: userData.money,
            level: userData.level,
            experience: userData.experience,
            lastLessonConcluded: userData.last_lesson_concluded,
            notifications: userData.notifications,
            pet: userData.pet
        }

        console.log('user: ', user)
        console.log('pet: ', pet)

        return { user, pet }
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
