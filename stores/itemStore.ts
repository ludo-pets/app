import { create } from 'zustand'
import Item from '@/dtos/Item'

import { getAllItemService } from '@/services/itemService'

interface ItemStoreState {
    items: Item[]
    loading: boolean
    error: string | null
    fetchItems: () => Promise<void>
    setItems: (items : Item[]) => void
}

export const useItemStore = create<ItemStoreState>((set) => ({
    items: [],
    loading: false,
    error:null,

    fetchItems: async () => {
        set({loading: true, error: null})
        try{
            const result = await getAllItemService()
            if(result) {
                set({ items: result.items, loading: false})
            } else {
                set({ error: 'Itens não encontrados', loading: false})
            }
        } catch(error: any) {
            set({ error: error.message || 'Erro ao buscar itens', loading: false})
        }
    },

        setItems: (items: Item[]) => set({items}),
}))