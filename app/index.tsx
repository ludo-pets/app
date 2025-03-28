import { Text, View } from 'react-native'
import '../global.css'
import Header from '@/components/ui/Header'

export default function Page() {
    return (
        <View >
            <View >
                <Header
                    title="Minigame"
                    showBackButton={true}
                    onBackPress={() => console.log('Go Back')}
                />
                {/* <Header title="Minigames" showBackButton />
                <Header title="PetShop" backgroundColor="lightgreen" />
                <Header title="Sem Ícone" /> */}
            </View>
        </View>
    )
}
