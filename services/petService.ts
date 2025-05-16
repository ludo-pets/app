import {
    addDoc,
    collection,
    doc,
    DocumentData,
    DocumentReference,
    getDoc,
    updateDoc,
} from 'firebase/firestore'
import { db } from '@/firebaseConfig'
import Pet from '@/dtos/Pet'

export const getPetDataByReference = async (
    petRef: DocumentReference<unknown, DocumentData>
) => {
    const petSnap = await getDoc(petRef)

    if (!petSnap.exists()) {
        console.error('Pet não encontrado')
        return null
    }

    return petSnap.data()
}

export const updatePet = async (
    petId: string,
    petData: Partial<Pet>
) => {
    if (!petId || Object.keys(petData).length === 0) return false

    try {
        const petRef = doc(db, 'Pet', petId)
        await updateDoc(petRef, { ...petData })
    } catch (error) {
        console.error('Erro ao atualizar Pet:', error)
        return false
    }
    
    return true
}

export type CreatePetData = {
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
                floor: 'defaultFloor',
                wallpaper: 'defaultWallpaper',
            },
            wellBeing: {
                clean: new Date(),
                fun: new Date(),
                hunger: new Date(),
                thirst: new Date(),
                sleep: new Date(),
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
