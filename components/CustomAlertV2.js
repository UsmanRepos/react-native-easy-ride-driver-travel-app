import { Modal, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, SIZES, icons, FONTS } from '../constants';

const CustomAlertV2 = ({ containerStyle, title, message, modalVisible, setModalVisible, handleSignOut }) => {
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
                    ...containerStyle
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
                            backgroundColor: title == 'Alert' ? COLORS.sceondary: 'red',
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
                            height: 190,
                            borderRadius: SIZES.radius,
                            paddingHorizontal: SIZES.padding *.9,
                            backgroundColor: COLORS.white
                        }}
                    >
                        <View
                            style={{
                                flex:1,
                                marginTop: 20,
                                flexDirection:'column',
                                justifyContent:'center',
                            }}
                        >
                            <Text style={{ ...FONTS.h2, textAlign: 'center' }}>{title}</Text>
                            <Text style={{ ...FONTS.body3, color: COLORS.gray50, textAlign:"center" }}>{message}</Text>
                        </View>
                        <View
                            style={{
                                height: 60,
                                alignItems:'center',
                                justifyContent:'flex-end',
                                width: '100%',
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                                style={{
                                    height: 40,
                                    marginRight:SIZES.base,
                                    paddingHorizontal: SIZES.radius,
                                    borderRadius: SIZES.base,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: COLORS.primary
                                }}
                                onPress={setModalVisible}
                            >
                                <Text style={{ ...FONTS.h3, color: COLORS.gray70 }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    height: 40,
                                    paddingHorizontal: SIZES.radius,
                                    borderRadius: SIZES.base,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: COLORS.primary
                                }}
                                onPress={handleSignOut}
                            >
                                <Text style={{ ...FONTS.h3, color: COLORS.white }}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        </Modal>
    )
}

export default CustomAlertV2