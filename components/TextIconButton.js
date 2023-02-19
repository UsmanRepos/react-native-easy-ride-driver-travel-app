import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { COLORS, FONTS, SIZES, icons} from '../constants'

const TextIconButton = ({ label, icon, iconStyle, labelStyle, containerStyle, onPress}) => {
  return (
    <TouchableOpacity
        style={{
            flexDirection:'row',
            height:60,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:COLORS.white,
            borderRadius:SIZES.radius,
            ...containerStyle
        }}
        onPress={onPress}
    >
        <Text style={{ marginRight:SIZES.base, ...FONTS.h2, ...labelStyle}}>{label}</Text>
        <Image 
            source={icon}
            resizeMode='contain'
            style={{
                width:25,
                height:25,
                ...iconStyle
            }}
        />
    </TouchableOpacity>
  );
};

export default TextIconButton;
