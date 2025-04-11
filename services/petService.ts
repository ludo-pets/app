import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig' // mudar quando tiver a configuração do firebase
import Pet from '@/dtos/Pet'

export const updatePetService = async (
    petId: string,
    petData: Partial<Pet>
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
