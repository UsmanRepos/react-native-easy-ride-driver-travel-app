import {
    Dimensions, StyleSheet, Text, View, Image, TouchableOpacity,
    TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView
} from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, FONTS, icons, SIZES } from '../../constants'
import { StatusBar } from 'expo-status-bar'
import { auth } from '../../firebase';
import { CustomAlert, PasswordResetModal } from '../../components'


const SignIn = ({ navigation }) => {

    const [alert, setAlert] = useState({
        title: '',
        message: ''
    });
    const [data, setData] = useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidEmail: true,
        isValidPassword: true,
    });
    const [userInFo, setUserInFo] = useState({
        email: '',
        newPassword: '',
        confirm_password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
        isValidUser: true,
        isValidEmail: true,
        isValidPassword: true,
        isMediumPassword: true,
        isStrongPassword: true,
        isValidConfirmPassword: true
    });


    const [disable, setDisable] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [passwordResetModal, setPasswordResetModal] = useState(false)


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace('tabs')
            }
        })
        return unsubscribe
    }, []);

    const handleSignIn = () => {
        auth
            .signInWithEmailAndPassword(data.username, data.password)
            .then(userCredentials => {
                setData({
                    username: '',
                    password: '',
                    check_textInputChange: false,
                    secureTextEntry: true,
                    isValidUser: true,
                    isValidPassword: true,
                });
                navigation.replace('tabs')
            })
            .catch(error => {
                setModalVisible(!modalVisible)
                setAlert({
                    title: 'Error',
                    message: error.message
                })
            })
    };

    const handleResetPassword = () => {
        const email = userInFo.email.trim()
        auth
            .sendPasswordResetEmail(email)
            .then(() => {
                setPasswordResetModal(!passwordResetModal)
                setUserInFo({
                    email: '',
                    newPassword: '',
                    confirm_password: '',
                    check_textInputChange: false,
                    secureTextEntry: true,
                    confirm_secureTextEntry: true,
                    isValidUser: true,
                    isValidPassword: true,
                });
            })
            .catch((error) => {
                setModalVisible(!modalVisible)
                setAlert({
                    title: 'Error',
                    message: error.message
                });
            });
    };

    const textChangeHandler = (val) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/

        if (val.trim().length >= 11) {
            if (reg.test(val)) {
                setData({
                    ...data,
                    username: val,
                    check_textInputChange: true,
                    isValidUser: true,
                    isValidEmail: true
                });
            } else {
                setData({
                    ...data,
                    username: val,
                    check_textInputChange: false,
                    isValidUser: true,
                    isValidEmail: false
                });
            }
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false,
                isValidEmail: false
            });
        }
    };

    const passwordChangeHandler = (val) => {
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

        if (val.trim().length >= 6) {
            setData({
                ...data,
                password: val,
                isValidPassword: true,
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    };

    const handleValidUser = (val) => {
        if (val.trim().length >= 11) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    };

    const handleVisibility = () => {
        const email = data.username.trim()
        const password = data.password.trim()

        if (email == "" || password == "") {
            setDisable(true);
        } else {
            setDisable(false)
        }

    };

    return (
        <View
            style={styles.container}
        >

            <StatusBar backgroundColor='#009387' style='light' />
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.text_header}>Join us via email address</Text>
            </View>

            {/* Footer */}
            <Animatable.View style={styles.footer}
                animation='fadeInUpBig'
            >
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
                        onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                        value={data.email}
                    />
                    {
                        data.check_textInputChange &&
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
                {data.isValidUser ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>User Name must be 11 characters long</Text>
                    </Animatable.View>
                }
                {data.isValidUser ? data.isValidEmail ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Email address is badly formated</Text>
                    </Animatable.View>
                    : null
                }

                {/* Password Field */}
                <Text style={[styles.text_footer, { marginTop: 35 }]}>Password</Text>
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
                        placeholder='Your Password'
                        style={styles.textInput}
                        autoCapitalize='none'
                        secureTextEntry={data.secureTextEntry}
                        onChangeText={(value) => {
                            passwordChangeHandler(value)
                            handleVisibility()
                        }}
                        value={data.password}
                    />
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setData({
                                ...data,
                                secureTextEntry: !data.secureTextEntry
                            })
                        }}
                    >
                        <Image
                            source={data?.secureTextEntry ? icons.disable_eye : icons.eye}
                            resizeMode='contain'
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: 'grey'
                            }}
                        />
                    </TouchableWithoutFeedback>
                </View>
                {data.isValidPassword ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Password must be 6 characters long</Text>
                    </Animatable.View>
                }

                <TouchableOpacity
                    onPress={() =>
                        setPasswordResetModal(!passwordResetModal)
                    }
                >
                    <Text style={{ color: COLORS.primary, marginTop: 15, ...FONTS.body3 }}>Forgot password?</Text>
                </TouchableOpacity>

                <View style={styles.button}>
                    <TouchableOpacity
                        disabled={disable}
                        style={{ width: '100%' }}
                        onPress={() => handleSignIn()}
                    >
                        <LinearGradient
                            colors={['#08d4c4', '#01ab9d']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, { color: 'white' }]}>SignIn</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.signIn, {
                            marginTop: 15,
                            borderColor: '#009387',
                            borderWidth: 1
                        }]}
                        onPress={() => navigation.navigate('signUp')}
                    >
                        <Text style={[styles.textSign, {
                            color: '#009387'
                        }]}>SignUp</Text>
                    </TouchableOpacity>

                </View>
            </Animatable.View >

            <CustomAlert
                title={alert.title}
                message={alert.message}
                modalVisible={modalVisible}
                setModalVisible={() => setModalVisible(!modalVisible)}
            />

            <PasswordResetModal
                userInFo={userInFo}
                modalVisible={passwordResetModal}
                setUserInFo={setUserInFo}
                setModalVisible={() => setPasswordResetModal(!passwordResetModal)}
                handleResetPassword={handleResetPassword}
                styles={styles}
            />
        </View>
    )
}

export default SignIn

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding * 2
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
        color: COLORS.white,
        ...FONTS.h1
    },
    text_footer: {
        ...FONTS.body3,
        color: '#05375a',
        fontSize: 18,
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
        fontSize: 18
    }
});
