import {create} from "zustand";
import { getPetById, IPet } from "../services/petService";

// Definição da interface do estado
interface PetState {
  pet: IPet | null;
  loading: boolean;
  error: string | null;
  fetchPet: (petId: string) => Promise<void>;
  setPet: (pet: IPet) => void;
}

export const usePetStore = create<PetState>((set) => ({
  pet: null,
  loading: false,
  error: null,

  // Função para buscar o Pet no Firestore via referência
  fetchPet: async (petId: string) => {
    set({ loading: true, error: null });
    try {
      const petData = await getPetById(petId);
      if (petData) {
        set({ pet: petData, loading: false });
      } else {
        set({ error: "Pet não encontrado", loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  // Função para setar o Pet manualmente, se necessário
  setPet: (pet: IPet) => set({ pet }),
}));