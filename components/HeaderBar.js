import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { COLORS, FONTS, SIZES, icons } from '../constants'


const HeaderBar = ({ title, leftOnPress, right, containerStyle }) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                paddingHorizontal: SIZES.padding,
                ...containerStyle
            }}
        >
            {/* Back Button */}
            <View
                style={{ alignItems: 'flex-start' }}
            >
                <TouchableOpacity
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: COLORS.transparentBlack4
                    }}
                    onPress={leftOnPress}
                >
                    <Image
                        source={icons.leftArrow}
                        resizeMode='contain'
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: COLORS.white
                        }}
                    />
                </TouchableOpacity>
            </View>

            {/* Title */}
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Text style={{  }}>{title}</Text>
            </View>

            {/* Setting Button */}
            <View
                style={{ alignItems: 'flex-start' }}
            >
                <TouchableOpacity
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: right ? COLORS.transparentBlack4 : null
                    }}
                >
                    {right &&
                        <Image
                            source={icons.settings}
                            resizeMode='contain'
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: COLORS.white
                            }}
                        />
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HeaderBar;

const styles = StyleSheet.create({});
