import { Modal, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import {useNavigation} from '@react-navigation/native'
import { COLORS, SIZES, icons, FONTS } from '../constants';

const CustomAlert = ({ containerStyle, title, message, modalVisible, setModalVisible }) => {
    const navigation = useNavigation()
    return (
        <Modal
            transparent={true}
            animationType='fade'
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: COLORS.transparentBlack4,
                }}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >

                    <View
                        style={{
                            width: 60,
                            height: 60,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: -30,
                            borderRadius: 30,
                            borderWidth: 3,
                            borderColor: COLORS.white,
                            backgroundColor: title == 'Alert' ? COLORS.sceondary : 'red',
                            zIndex: 1
                        }}
                    >
                        <Image
                            source={icons.warning}
                            resizeMode='cover'
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: COLORS.white
                            }}
                        />
                    </View>
                    <View
                        style={{
                            width: 300,
                            height: 180,
                            justifyContent: 'center',
                            borderRadius: SIZES.radius,
                            paddingHorizontal: SIZES.base,
                            backgroundColor: COLORS.white
                        }}
                    >
                        <Text style={{ ...FONTS.h2, textAlign: 'center' }}>{title}</Text>
                        <Text style={{ ...FONTS.body3, textAlign: 'center', color: COLORS.gray50 }}>{message}</Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            marginTop: SIZES.base,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: COLORS.white
                        }}
                        onPress={() => {
                            setModalVisible()
                            if (message.includes('planning') || message.includes('booking') || message.includes('deleted')) {
                                navigation.replace('authentication', {
                                    screen: 'signIn',
                                })
                            }
                        }}
                    >
                        <Image
                            source={icons.close}
                            resizeMode='cover'
                            style={{
                                width: 20,
                                height: 20
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default CustomAlert