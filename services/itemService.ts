import Item from '@/dtos/Item'
import { db } from '@/firebaseConfig'
import { collection, getDocs} from 'firebase/firestore'

export const getAllItemService = async (): Promise<{items: Item[]} | null> => {
    try{
        const itemCollectionRef = collection(db, 'Item')
        const itemsSnapshot = await getDocs(itemCollectionRef)

        const items: Item[] = itemsSnapshot.docs.map((doc) => {
            const data = doc.data()
            return{
                id: doc.id,
                name: data.name,
                price: data.price,
                requiredLevel: data.requiredLevel,
                category: data.category,
                image: data.image,
                type: data.type,
            }
        })

        return { items }
    } catch (error) {
        console.error('Erro ao buscar itens:', error)
        return null
    }
}
