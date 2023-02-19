import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, SIZES, FONTS } from '../constants'

const TextButton = ({containerStyle, label, labelStyle, onPress}) => {
  return (
    <TouchableOpacity
        style={{
            height:55,
            justifyContent:'center',
            alignItems:'center',
            borderRadius:SIZES.radius,
            backgroundColor:COLORS.primary,
            ...containerStyle
        }}
        onPress={onPress}
    >
        <Text style={{
            color:COLORS.white,
            ...FONTS.h3,
            ...labelStyle
        }}>{label}</Text>
    </TouchableOpacity>
  )
}

export default TextButton

const styles = StyleSheet.create({})