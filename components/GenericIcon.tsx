import React from 'react';
import { SvgProps } from 'react-native-svg';

interface GenericIconProps {
    Icon: React.FC<SvgProps>;
    fill?: string;
    stroke?: string;
}

const GenericIcon: React.FC<GenericIconProps> = ({ Icon, fill = '#000', stroke = '#000' }) => {
    return <Icon fill={fill} stroke={stroke} />;
};

export default GenericIcon;
