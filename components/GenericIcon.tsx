import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { SvgProps } from 'react-native-svg'

interface GenericIconProps {
    Icon: React.FC<SvgProps>
    size?: number
    fill?:string
    stroke?: string
}

const GenericIcon: React.FC<GenericIconProps> = ({
    Icon,
    fill = '#000',
    stroke = '#000',
}) => {
    return <Icon fill={fill} stroke={stroke} />
}
export default GenericIcon

const styles = StyleSheet.create({
    icon: {
        // width e height são definidos via props
    },
})
