import { StyleSheet, TouchableOpacity, Animated } from 'react-native'
import React, {useRef,  useEffect } from 'react'
import { COLORS, SIZES } from '../constants'
 
const CustomRadioButton = ({ isSelected, onPress }) => {
    const radioAnimated = useRef(new Animated.Value(0)).current

    const circleColorAnimated =  radioAnimated.interpolate({
        inputRange:[0,17],
        outputRange:[COLORS.gray40, COLORS.sceondary]
    });

    const lineColorAnimated = radioAnimated.interpolate({
        inputRange:[0, 17],
        outputRange:[COLORS.additionalColor4, COLORS.gray10]
    });

    useEffect(() => {
        if (isSelected) {
            Animated.timing(radioAnimated, {
                toValue: 17,
                duration: 300,
                useNativeDriver: false
            }).start();
        } else {
            Animated.timing(radioAnimated, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
        }
    }, [isSelected])

    return (
        < TouchableOpacity
            style={{
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center"
            }
            }
            onPress={onPress}
        >
            <Animated.View
                style={{
                    width: "100%",
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: lineColorAnimated,
                    justifyContent: "center"
                }}
            >
                <Animated.View
                    style={{
                        position: "absolute",
                        left: radioAnimated,
                        width: 25,
                        height: 25,
                        borderRadius: 15,
                        borderColor: circleColorAnimated,
                        borderWidth: 5,
                        backgroundColor: COLORS.gray10
                    }}
                ></Animated.View>
            </Animated.View>
        </TouchableOpacity >
    )
}

export default CustomRadioButton

const styles = StyleSheet.create({})