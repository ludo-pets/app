import Item from '@/dtos/Item'
import { db } from '@/firebaseConfig'
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore'

export const getAllItems = async (): Promise<{
    items: Item[]
} | null> => {
    try {
        const itemCollectionRef = collection(db, 'Item')
        const itemsSnapshot = await getDocs(itemCollectionRef)

        const items: Item[] = itemsSnapshot.docs.map((doc) => {
            const data = doc.data()
            return {
                id: data.id || doc.id,
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
        console.log('Erro ao buscar itens:', error)
        return null
    }
}

export const addItem = async (): Promise<null> => {
    try {
        const itemCollectionRef = collection(db, 'Item')
        // const item = {
        //         category: 'foods',
        //         id: 'defaultWallpaper',
        //         image: '#C0DFF3',
        //         name: 'Parede Padrão',
        //         price: 0,
        //         requiredLevel: 0,
        //         type: 'wallpaper',
        //     }

        // const defaultItems = [
        //     {
        //         itemId: 'defaultToy',
        //         quantity: 1,
        //         image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+4.png',
        //     },
        //     {
        //         itemId: 'defaultBed',
        //         quantity: 1,
        //         image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+7.png',
        //     },
        //     {
        //         itemId: 'defaultFood',
        //         quantity: 1000,
        //         image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+36.png',
        //     },
        //     {
        //         itemId: 'defaultWC',
        //         quantity: 1,
        //         image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+21.png',
        //     },
        //     {
        //         itemId: 'defaultFloor',
        //         quantity: 1,
        //         image: '#B6E683',
        //     },
        //     {
        //         itemId: 'defaultWallpaper',
        //         quantity: 1,
        //         image: '#C0DFF3',
        //     },
        //     {
        //         itemId: 'defaultWater',
        //         quantity: 1,
        //         image: 'https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/objects/objetos/Ativo+41.png',
        //     },
        // ]
        
        // addDoc(itemCollectionRef, item)
        

        // Promise.all(
        //     defaultItems.map((item) => {
        //         addDoc(itemCollectionRef, item)
        //     })
        // )

        return null
    } catch (error) {
        console.log('Erro ao adicionar Pet:', error)
        return null
    }
}

// export async function duplicateDocument() {
//     const petRef = doc(db, 'User', '92qmUiZCLIjt7iGbJptc')
//     const petSnap = await getDoc(petRef)

//     console.log(petSnap.data())

//     if (petSnap) {
//         const itemCollectionRef = collection(db, 'User')

//         const newPet = await addDoc(itemCollectionRef, petSnap.data())

//         console.log('Documento duplicado com ID:', newPet.id)
//     } else {
//         console.log('Documento não encontrado!')
//     }
// }
