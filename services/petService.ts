import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig' // mudar quando tiver a configuração do firebase
import { IPet } from '@/dtos/IPet'

export const getPetByIdService = async (
    petId: string
): Promise<IPet | null> => {
    try {
        const petRef = doc(db, 'Pet', petId)
        const petSnap = await getDoc(petRef)

        if (petSnap.exists()) {
            const data = petSnap.data()
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

export const updatePetService = async (
    petId: string,
    petData: Partial<IPet>
) => {
    try {
        const petRef = doc(db, 'Pet', petId)
        await updateDoc(petRef, { ...petData })
        
        return true
    } catch (error) {
        console.error('Erro ao atualizar Pet:', error)
        return null
    }
}
