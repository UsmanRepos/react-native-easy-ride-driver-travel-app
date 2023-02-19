import { Modal, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'
import { COLORS, SIZES, FONTS, icons } from '../constants'

const PasswordResetModal = ({
    styles, modalVisible, setModalVisible, userInFo,
    handleResetPassword, setUserInFo
}) => {

    const [disable, setDisable] = useState(true)

    const handleVisibility = () => {
        
        const email = userInFo.email.trim()

        if (email == "") {
            setDisable(true)
        } else {
            setDisable(false)
        }
    };

    const textChangeHandler = (val) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/

        if (val.trim().length >= 11) {
            if (reg.test(val)) {
                setUserInFo({
                    ...userInFo,
                    email: val,
                    check_textInputChange: true,
                    isValidUser: true,
                    isValidEmail: true
                });
            } else {
                setUserInFo({
                    ...userInFo,
                    email: val,
                    check_textInputChange: false,
                    isValidUser: true,
                    isValidEmail: false
                });
            }
        } else {
            setUserInFo({
                ...userInFo,
                email: val,
                check_textInputChange: false,
                isValidUser: false,
                isValidEmail: false
            });
        }
    };

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible}
        >
            <KeyboardAvoidingView
                behavior={"height"}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.text_header}>Reset Password</Text>
                        </View>

                        {/* Footer */}
                        <Animatable.View
                            style={styles.footer}
                            animation='fadeInUpBig'
                        >

                            <Text style={[styles.text_footer, { marginBottom: 25 }]}>
                                Please enter the email address where you'd like to receive reset email.
                            </Text>

                            {/* Email Field */}
                            <Text style={styles.text_footer}>Email</Text>
                            <View style={styles.action}>
                                <Image
                                    source={icons.email}
                                    resizeMode='contain'
                                    style={{
                                        width: 20,
                                        height: 20,
                                        tintColor: '#05375a'
                                    }}
                                />
                                <TextInput
                                    placeholder='Your Email'
                                    style={styles.textInput}
                                    onChangeText={(value) => {
                                        textChangeHandler(value)
                                        handleVisibility()
                                    }}
                                    value={userInFo.email}
                                />
                                {
                                    userInFo.check_textInputChange &&
                                    <Animatable.View
                                        animation={'bounceIn'}
                                    >
                                        <Image
                                            source={icons.completed}
                                            resizeMode='contain'
                                            style={{
                                                width: 20,
                                                height: 20,
                                            }}
                                        />
                                    </Animatable.View>
                                }
                            </View>
                            {userInFo.isValidUser ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>User Name must be 11 characters long</Text>
                                </Animatable.View>
                            }
                            {userInFo.isValidUser ? userInFo.isValidEmail ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>Email address is badly formated</Text>
                                </Animatable.View>
                                : null
                            }


                            {/* Buttons */}
                            <View style={styles.button}>
                                <TouchableOpacity
                                    disabled={disable}
                                    style={{ width: '100%' }}
                                    onPress={() => {
                                        handleResetPassword()
                                    }}
                                >
                                    <LinearGradient
                                        colors={['#08d4c4', '#01ab9d']}
                                        style={styles.signIn}
                                    >
                                        <Text style={[styles.textSign, { color: 'white' }]}>Reset Password</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.signIn, {
                                        marginTop: 15,
                                        borderColor: '#009387',
                                        borderWidth: 1
                                    }]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={[styles.textSign, {
                                        color: '#009387'
                                    }]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </Animatable.View >
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default PasswordResetModal

const styles = StyleSheet.create({})
