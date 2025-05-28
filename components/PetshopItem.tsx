import { Pet } from '@/dtos/Pet'
import  Item  from '@/dtos/Item'
import { useUserPetStore } from '@/stores/userPetStore'
import { useEffect, useState } from 'react'
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'

const petCoin = require('@/assets/images/profile/pet_coin.png')

export interface PetshopItemProps {
  id: string
  name: string
  price: number
  category: string
  has_required_level: boolean | null
  image: string
  quantity: number
  has_item: boolean
  is_active: boolean
  type: string
}

const { width } = Dimensions.get('window')

export default function PetshopItem({ item }: { item: PetshopItemProps }) {

    const user = useUserPetStore((state) => state.user);
    const pet = useUserPetStore((state) => state.pet);
    const userUpdate = useUserPetStore((state) => state.updateUser);
    const petUpdate = useUserPetStore((state) => state.updatePet)
    const fetchUserAndPet = useUserPetStore(state => state.fetchUserAndPet)
    const [hasItem, setHasItem] = useState(false)
    const [quantity, setQuantity] = useState<number>(item.quantity);
    const [canBuy, setCanBuy] = useState(false);
    const [isActive, setIsActive] = useState(item.is_active)

    useEffect(()=> {

        let activeItems: {[Key: string]: string};
        if(pet) {
            activeItems = {...pet.activeItems};
            
            setIsActive(activeItems[item.type || "toy"] == item.id)
            const thisItem = pet.purchasedItems.find(i => i.itemId == item.id)
            
            setHasItem(thisItem != null)
            setQuantity(thisItem?.quantity || 0);
            
        }
        if(user)
            
            setCanBuy(user?.money >= item.price)
            
    },[user, pet])

    const onActive = async () => {
       if(pet && user){
        const activeItems: {[Key: string]: string} = {...pet.activeItems};
        activeItems[item.type || "toy"] = item.id;
        await petUpdate(pet.id, { activeItems: activeItems as any })
        await fetchUserAndPet(user.email);
       }
    }
    const onDesactive = () => {console.log(item.quantity);
    }
    const onBuy = async () => {
        if(user && pet){
            const newUser = {...user}
            const newPet: Pet  = {...pet}
            let curItem = null;
            newPet.purchasedItems
                .forEach((i) => {
                    
                    if(i.itemId == item.id) {
                        
                        curItem = i;
                        i.quantity = i.quantity! + 1;
                        return;
                    }
                });
            if(!curItem) {

                const newItem = {...item, quantity: 1, type: item.type || "toy", itemId: item.id};
                newPet.purchasedItems.push(...pet.purchasedItems, newItem);
                
            }

            
            await userUpdate(user.id, { money: newUser.money - item.price });
            await petUpdate(pet.id, {purchasedItems: newPet.purchasedItems});
            await fetchUserAndPet(user.email);
            
        
                
        }
    }

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={item.image ? { uri: item.image } : undefined}
          style={styles.image}
          resizeMode="contain"
        />
        
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityText}>{quantity}</Text>
        </View>
        
      </View>

      <View style={styles.details}>
        <View style={styles.rowTop}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.price}>
            <Image source={petCoin} style={styles.coin} />
            <Text style={styles.priceText}>{item.price}</Text>
          </View>
        </View>

        <View style={styles.rowButtons}>
          {hasItem && (
            <Pressable
              style={[
                styles.button,
                isActive ? styles.desactive : styles.active,
              ]}
              onPress={() => onActive()}
              disabled={!canBuy}
            >
              <Text
                style={[
                  styles.buttonText,
                  isActive && styles.buttonActiveText,
                ]}
              >
                {isActive ? 'DESATIVAR' : 'ATIVAR'}
              </Text>
            </Pressable>
          )}
          <Pressable
            style={[
              styles.button,
              item.has_required_level ? styles.unlocked : styles.locked,
              styles.buyButton,
            ]}
            onPress={() => onBuy()}
            disabled={!item.has_required_level}
          >
            <Text style={styles.buttonText}>COMPRAR</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EDEDED',
    padding: 12,
    alignItems: 'center',
    marginVertical: 4,
    minHeight: 90,
    maxHeight: 90,
  },
  imageContainer: {
    width: width * 0.18,
    aspectRatio: 1,
    backgroundColor: '#CFE2A8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  image: {
    width: '70%',
    height: '70%',
  },
  quantityBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#80BEE7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  quantityText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  details: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coin: {
    width: width * 0.05,
    height: width * 0.05,
    marginRight: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  buyButton: {
    marginLeft: 'auto',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFF',
  },
  buttonActiveText: {
    color: '#5B5B5B',
  },
  active: {
    backgroundColor: '#D4E4EB',
  },
  desactive: {
    backgroundColor: '#EDB0B0',
  },
  unlocked: {
    backgroundColor: '#6DA92C',
  },
  locked: {
    backgroundColor: '#5B5B5B',
  },

})
