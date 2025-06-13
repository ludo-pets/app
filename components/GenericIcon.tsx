import React from 'react'
import { Image, ImageSourcePropType, StyleSheet } from 'react-native'

interface GenericIconProps {
    Icon: ImageSourcePropType // ✅ aceita imagem local (require) ou remota ({ uri })
    size?: number
}

const GenericIcon: React.FC<GenericIconProps> = ({ Icon, size = 80 }) => {
    return (
        <Image
            source={Icon}
            style={[styles.icon, { width: size, height: size }]}
            resizeMode="contain"
        />
    )
}

export default GenericIcon

const styles = StyleSheet.create({
    icon: {
        // width e height são definidos via props
    },
})
