import { create } from 'zustand'
import { getPetByIdService, updatePetService } from '../services/petService'
import { IPet } from '@/dtos/IPet'

// Definição da interface do estado
interface PetState {
    pet: IPet | null
    loading: boolean
    error: string | null
    fetchPet: (petId: string) => Promise<void>
    updatePet: (petId: string, petData: Partial<IPet>) => Promise<void>
    setPet: (pet: IPet) => void
}

export const usePetStore = create<PetState>((set, get) => ({
    pet: null,
    loading: false,
    error: null,
    fetchPet: async (petId: string) => {
        set({ loading: true, error: null })
        try {
            const petData = await getPetByIdService(petId)
            if (petData) {
                set({ pet: petData, loading: false })
            } else {
                set({ error: 'Pet não encontrado', loading: false })
            }
        } catch (error: any) {
            set({ error: error.message, loading: false })
        }
    },
    updatePet: async (petId: string, petData: Partial<IPet>) => {
        set({ loading: true, error: null })
        try {
            const newPet = await updatePetService(petId, petData)
            const oldPet = get().pet
            if (oldPet && newPet) {
                set({
                    pet: {
                        ...oldPet,
                        ...petData,
                    },
                    loading: false,
                })
            } else {
                set({
                    error: 'Pet não encontrado ou erro ao atualizaro pet',
                    loading: false,
                })
            }
        } catch (error: any) {
            set({ error: error.message, loading: false })
        }
    },
    setPet: (pet: IPet) => set({ pet }),
}))
