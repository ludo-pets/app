import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig' // mudar quando tiver a configuração do firebase

export interface IPet {
    id: string
    name: string
    color: string
    type: 'Gato' | 'Cachorro'
    items: Array<{
        is_active: boolean
        item_id: string // ID do item (ou DocumentReference)
        quantity: number
    }>
    well_being: {
        clean: number
        fun: number
        hunger: number
        thirst: number
    }
}

export const getPetById = async (petId: string): Promise<IPet | null> => {
    try {
        const petRef = doc(db, 'Pet', petId)
        const petSnap = await getDoc(petRef)

        if (petSnap.exists()) {
            const data = petSnap.data()
            // Ajuste o casting para o seu tipo:
            const petData: IPet = {
                id: petSnap.id,
                name: data.name,
                color: data.color,
                type: data.type,
                items: data.items || [],
                well_being: data['well-being'] || {
                    clean: 0,
                    fun: 0,
                    hunger: 0,
                    thirst: 0,
                },
            }
            return petData
        } else {
            return null
        }
    } catch (error) {
        console.error('Erro ao buscar Pet:', error)
        return null
    }
}
