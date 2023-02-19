import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../constants'

const LineDivider = ({ lineStyle}) => {
  return (
    <View
        style={{
            width:'100%',
            height:1,
            backgroundColor:COLORS.gray20,
            ...lineStyle
        }}
    />
  )
}

export default LineDivider

const styles = StyleSheet.create({})