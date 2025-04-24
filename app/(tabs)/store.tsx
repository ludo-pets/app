import { useState } from 'react'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

type FilterTitle = {
    id: number
    name: string
}

type ItemShop = {
    id: number
    name: string
    category: string
}
const filterTitles : FilterTitle[] = [
    { id: 1, name: 'Alimentação' },
    { id: 2, name: 'Brinquedos' },
    { id: 3, name: 'Ambiente' },
]

const itemsShop: ItemShop[] = [
    // Alimentação
    { id: 1, name: 'Ração seca premium', category: 'Alimentação' },
    { id: 2, name: 'Ração úmida gourmet', category: 'Alimentação' },
    { id: 3, name: 'Petiscos naturais', category: 'Alimentação' },
    { id: 4, name: 'Ossinho de couro', category: 'Alimentação' },
    { id: 5, name: 'Biscoitos para cães', category: 'Alimentação' },
    { id: 6, name: 'Suplemento vitamínico', category: 'Alimentação' },
    { id: 7, name: 'Sache de carne', category: 'Alimentação' },
    { id: 8, name: 'Leite especial para filhotes', category: 'Alimentação' },
    { id: 9, name: 'Comida natural congelada', category: 'Alimentação' },
    { id: 10, name: 'Snacks dentais', category: 'Alimentação' },
  
    // Brinquedos
    { id: 11, name: 'Brinquedo de corda', category: 'Brinquedos' },
    { id: 12, name: 'Bola com apito', category: 'Brinquedos' },
    { id: 13, name: 'Pelúcia mordedor', category: 'Brinquedos' },
    { id: 14, name: 'Disco frisbee', category: 'Brinquedos' },
    { id: 15, name: 'Brinquedo com dispenser de comida', category: 'Brinquedos' },
    { id: 16, name: 'Corda trançada grande', category: 'Brinquedos' },
    { id: 17, name: 'Mordedor de borracha', category: 'Brinquedos' },
    { id: 18, name: 'Bola texturizada', category: 'Brinquedos' },
    { id: 19, name: 'Brinquedo com som de bichinho', category: 'Brinquedos' },
    { id: 20, name: 'Pezinho de pelúcia', category: 'Brinquedos' },
  
    // Ambiente
    { id: 21, name: 'Cama para cachorro', category: 'Ambiente' },
    { id: 22, name: 'Casinha de madeira', category: 'Ambiente' },
    { id: 23, name: 'Tapete higiênico lavável', category: 'Ambiente' },
    { id: 24, name: 'Cobertor pet', category: 'Ambiente' },
    { id: 25, name: 'Comedouro antiderrapante', category: 'Ambiente' },
    { id: 26, name: 'Bebedouro automático', category: 'Ambiente' },
    { id: 27, name: 'Grade para ambiente interno', category: 'Ambiente' },
    { id: 28, name: 'Piso gelado para o verão', category: 'Ambiente' },
    { id: 29, name: 'Tenda portátil', category: 'Ambiente' },
    { id: 30, name: 'Almofada ortopédica', category: 'Ambiente' },
  ];
export default function StoreScreen() {

    const [selectedFilter, setSelectedFilter] = useState<FilterTitle>(filterTitles[0])

    return (
        <View style={styles.container}>
            <View style={styles.filter}>
                {filterTitles.map((title) => (
                    <Pressable onPress={() => setSelectedFilter(title)} key={title.id} style={styles.titleBox}>
                        <Text style={styles.title}>{title.name}</Text>
                        {title.id === selectedFilter.id && (
                            <View style={styles.notch} />
                        )}
                    </Pressable>
                ))}
            </View>

            <View style={styles.itemsShopBox}>
                <FlatList
                    style={{ width: '100%' }}
                    data={itemsShop.filter(item => item.category === selectedFilter.name)}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable style={styles.itemShop}>
                            <Text style={styles.itemShopText}>{item.name}</Text>
                        </Pressable>
                    )}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}                                                                                         

                />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    filter:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#cac4d0',
        padding: 10,
    },
    container: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        color: "#5B5B5B",
    },

    titleBox: {
        position: 'relative',
    },
    notch: {
        height: 3,
        width: '100%',
        backgroundColor: "#5B5B5B",
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        transform: [{ translateY: 10 }],
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
      },

      itemsShopBox : {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 10,
      },

      itemShop:{
        height: 92,
        backgroundColor: '#E5E5E5',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },

    itemShopText:{
        color: '#5B5B5B',
        fontWeight: 'bold',
        fontSize: 16,
    },
      
})
