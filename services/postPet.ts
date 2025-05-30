import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import { Pet } from '@/dtos/Pet'

type CreatePetData = {
    name: string
    color: string
    type: 'cat' | 'dog'
}

/**
 * POSTS a Pet document to the Firestore "Pet" collection.
 * @param petData - The basic data for the new pet (name, color, type).
 * @returns The newly created Pet document object with its ID, or null if an error occurred.
 */
export const addPet = async (petData: CreatePetData): Promise<Pet | null> => {
    try {
        const petCollectionRef = collection(db, 'Pet')

        const newPetDocData = {
            name: petData.name,
            color: petData.color,
            type: petData.type,
            purchasedItems: [],
            activeItems: {
                toy: 'abc',
                wc: 'abc',
                food: 'cba',
                bed: 'bbb',
                wallpaper: 'ddd',
                floor: 'ddd',
            },
            wellBeing: {
                clean: new Date().toString(),
                fun: new Date().toString(),
                hunger: new Date().toString(),
                thirst: new Date().toString(),
                sleep: new Date().toString(),
            },
        }

        const docRef = await addDoc(petCollectionRef, newPetDocData)

        const createdPet: Pet = {
            ...newPetDocData,
            id: docRef.id,
            purchasedItems:
                newPetDocData.purchasedItems as unknown as Pet['purchasedItems'],
        }

        return createdPet
    } catch (error) {
        console.error('Erro ao adicionar Pet:', error)
        return null
    }
}
