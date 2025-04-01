import { Text, View } from 'react-native'
import '../global.css'
import Header from '@/components/ui/Header'
import Coin from '@/components/Coins'

export default function Page() {
    return (
        <View >
            <View >
                <Header
                    title="Minigame"
                    showBackButton={true}
                    onBackPress={() => console.log('Go Back')}
                    coinsValue={100}
                />
                <Header title="Minigames" showBackButton />
                <Header title="PetShop" backgroundColor="lightgreen" />
                <Header title="Sem Ícone" />
                <Header title="coins" coinsValue={100}/>
    
            </View>
        </View>
    )
}
