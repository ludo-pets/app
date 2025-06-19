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
import { Pet } from '@/dtos/Pet'

export const getPetDataById = async (pet: string) => {
    const petRef: DocumentReference<DocumentData> = doc(db, 'Pet', pet)
    const petSnap = await getDoc(petRef)

    if (!petSnap.exists()) {
        console.log('Pet não encontrado')
        return null
    }

    return petSnap.data()
}

export const updatePet = async (petId: string, petData: Partial<Pet>) => {
    if (!petId || Object.keys(petData).length === 0) return false

    try {
        const petRef = doc(db, 'Pet', petId)
        await updateDoc(petRef, { ...petData })
    } catch (error) {
        console.log('Erro ao atualizar Pet:', error)
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

        const nowISOString = new Date().toISOString()
        const newPetDocData = {
            name: petData.name,
            color: petData.color,
            type: petData.type,
            purchasedItems: [
                {
                    itemId: 'defaultToy',
                    quantity: 1,
                    image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+4.png',
                },
                {
                    itemId: 'defaultBed',
                    quantity: 1,
                    image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+7.png',
                },
                {
                    itemId: 'defaultFood',
                    quantity: 1000,
                    image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+36.png',
                },
                {
                    itemId: 'defaultWC',
                    quantity: 1,
                    image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+21.png',
                },
                {
                    itemId: 'defaultFloor',
                    quantity: 1,
                    image: '#B6E683',
                },
                {
                    itemId: 'defaultWallpaper',
                    quantity: 1,
                    image: '#C0DFF3',
                },
                {
                    itemId: 'defaultWater',
                    quantity: 1,
                    image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+41.png',
                },
            ],
            activeItems: {
                toy: 'defaultToy',
                wc: 'defaultWC',
                food: 'defaultFood',
                bed: 'defaultBed',
                floor: 'defaultFloor',
                wallpaper: 'defaultWallpaper',
            },
            wellBeing: {
                clean: nowISOString,
                fun: nowISOString,
                hunger: nowISOString,
                thirst: nowISOString,
                sleep: nowISOString,
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
        console.log('Erro ao adicionar Pet:', error)
        return null
    }
}
