import { Text, View } from 'react-native'
import '../global.css'

export default function Page() {
    return (
        <View className="flex-1 items-center p-6 bg-ludo-primary-white-ice">
            <View className="flex-1 justify-center max-w-[960px] mx-auto">
                <Text className="text-6xl text-ludo-primary-pink1 font-body">
                    Ludo Pets
                </Text>
                <Text className="text-4xl text-ludo-primary-ligh-blue font-title">
                    TailwindCss
                </Text>
                <Text className="text-2xl text-ludo-primary-light-green font-body">
                    Testing Styles.
                </Text>
            </View>
        </View>
    )
}
