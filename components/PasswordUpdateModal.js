import { Modal, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'
import { COLORS, SIZES, icons, FONTS } from '../constants'

const PasswordUpdateModal = ({
    modalVisible, setModalVisible, userInFo,
    handleUpdatePassword, setUserInFo
}) => {

    const [disable, setDisable] = useState(true)

    const handleVisibility = () => {
        const newPassword = userInFo.newPassword.trim()
        const password = userInFo.currentPassword.trim()

        if (newPassword == "" || password == "") {
            setDisable(true);
        } else {
            setDisable(false)
        }

    };

    const passwordChangeHandler = (val) => {
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

        if (val.trim().length >= 6) {
            if (mediumRegex.test(val)) {
                if (strongRegex.test(val)) {
                    setUserInFo({
                        ...userInFo,
                        newPassword: val,
                        isValidPassword: true,
                        isMediumPassword: true,
                        isStrongPassword: true
                    });
                } else {
                    setUserInFo({
                        ...userInFo,
                        newPassword: val,
                        isValidPassword: true,
                        isMediumPassword: true,
                        isStrongPassword: false
                    });
                }
            } else {
                setUserInFo({
                    ...userInFo,
                    newPassword: val,
                    isValidPassword: true,
                    isMediumPassword: false,
                    isStrongPassword: false
                });
            }
        } else {
            setUserInFo({
                ...userInFo,
                newPassword: val,
                isValidPassword: false,
                isMediumPassword: false,
                isStrongPassword: false
            });
        }
    };

    const oldPasswordChangeHandler = (val) => {
        if (val.trim().length >= 6) {
            setUserInFo({
                ...userInFo,
                currentPassword: val,
                isValidOldPassword: true
            });
        } else {
            setUserInFo({
                ...userInFo,
                currentPassword: val,
                isValidOldPassword: false
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
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.text_header}>Update Password</Text>
                </View>

                {/* Footer */}
                <Animatable.View
                    style={styles.footer}
                    animation='fadeInUpBig'
                >
                    {/* New Password Field */}
                    <Text style={styles.text_footer}>Old Password</Text>
                    <View style={styles.action}>
                        <Image
                            source={icons.password}
                            resizeMode='contain'
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: '#05375a'
                            }}
                        />
                        <TextInput
                            placeholder='Enter Your Old Password'
                            style={styles.textInput}
                            autoCapitalize='none'
                            secureTextEntry={userInFo.current_secureTextEntry}
                            onChangeText={(text) => {
                                oldPasswordChangeHandler(text)
                                handleVisibility()
                            }}
                            value={userInFo.currentPassword}
                        />
                        <TouchableWithoutFeedback
                            onPress={() => {
                                setUserInFo({
                                    ...userInFo,
                                    current_secureTextEntry: !userInFo.current_secureTextEntry
                                })
                            }}
                        >
                            <Image
                                source={userInFo.current_secureTextEntry ? icons.disable_eye : icons.eye}
                                resizeMode='contain'
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: 'grey'
                                }}
                            />
                        </TouchableWithoutFeedback>
                    </View>
                    {userInFo.isValidOldPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Password must be 6 characters long</Text>
                        </Animatable.View>
                    }

                    {/* Confirm Password Field */}
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>New Password</Text>
                    <View style={styles.action}>
                        <Image
                            source={icons.password}
                            resizeMode='contain'
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: '#05375a'
                            }}
                        />
                        <TextInput
                            placeholder='Enter Your New Password'
                            style={styles.textInput}
                            autoCapitalize='none'
                            secureTextEntry={userInFo.new_secureTextEntry}
                            onChangeText={(text) => {
                                passwordChangeHandler(text)
                                handleVisibility()
                            }}
                            value={userInFo.newPassword}
                        />

                        <TouchableWithoutFeedback
                            onPress={() => {
                                setUserInFo({
                                    ...userInFo,
                                    new_secureTextEntry: !userInFo.new_secureTextEntry
                                })
                            }}
                        >
                            <Image
                                source={userInFo?.new_secureTextEntry ? icons.disable_eye : icons.eye}
                                resizeMode='contain'
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: 'grey'
                                }}
                            />
                        </TouchableWithoutFeedback>
                    </View>
                    {userInFo.isValidPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Password must be 6 characters long</Text>
                        </Animatable.View>
                    }
                    {
                        userInFo.isValidPassword ? userInFo.isMediumPassword ? null
                            : <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={{ ...FONTS.body4, color: COLORS.sceondary }}>Weak Password</Text>
                            </Animatable.View>
                            : null
                    }
                    {
                        userInFo.isValidPassword ? userInFo.isMediumPassword ? userInFo.isStrongPassword ? null
                            :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={{ ...FONTS.body4, color: COLORS.primary }}>Medium Password</Text>
                            </Animatable.View>
                            : null : null
                    }

                    {/* Buttons */}
                    <View style={styles.button}>
                        <TouchableOpacity
                            disabled={disable}
                            style={{ width: '100%' }}
                            onPress={() => {
                                handleUpdatePassword()
                            }}
                        >
                            <LinearGradient
                                colors={['#08d4c4', '#01ab9d']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, { color: 'white' }]}>Update Password</Text>
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
            </View>
        </Modal>
    )
}

export default PasswordUpdateModal


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        ...FONTS.body3,
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        height: '100%',
        marginLeft: 10,
        color: '#05375a',
        ...FONTS.body4
    },
    errorMsg: {
        ...FONTS.body4,
        color: '#FF0000',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        ...FONTS.h3,
        fontSize: 18,
    }
});



