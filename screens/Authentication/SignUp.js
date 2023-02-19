import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity, Platform, TextInput, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Animatable from 'react-native-animatable'
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient'
import { CustomAlert } from '../../components'
import { COLORS, FONTS, icons, SIZES } from '../../constants'
import { StatusBar } from 'expo-status-bar'
import { auth, db } from '../../firebase'

const SignUp = ({ navigation }) => {

    const [disable, setDisable] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [alert, setAlert] = useState({
        title: '',
        message: ''
    });

    const [data, setData] = useState({
        email: '',
        password: '',
        confirm_password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
        isValidUser: true,
        isValidEmail: true,
        isValidPassword: true,
        isMediumPassword: true,
        isStrongPassword: true,
        isValidConfirmPassword: true,
    });

    const [userLocation, setUserLocation] = useState({
        latitude: '',
        longitude: ''
    })

    useEffect(async () => {
        try {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== "granted") {
                setAlert({
                    title: 'Alert',
                    message: 'To run this app access to location is needed'
                })
                setModalVisible(!modalVisible)
            }
            let location = await Location.getCurrentPositionAsync();
            const { latitude, longitude } = location.coords;
            setUserLocation({
                latitude: latitude,
                longitude: longitude
            })
        } catch (error) {
            setAlert({
                title: 'Error',
                message: error.message
            })
            setModalVisible(!modalVisible)
        }
    }, [])

    const handleSignUp = () => {
        auth
            .createUserWithEmailAndPassword(data.email, data.password)
            .then(userCredentials => {
                const user = userCredentials.user
                user.sendEmailVerification()
                addUser(user)
                user.
                    setData({
                        email: '',
                        password: '',
                        confirm_password: '',
                        check_textInputChange: false,
                        secureTextEntry: true,
                        confirm_secureTextEntry: true
                    })
                navigation.replace('tabs')
            })
            .catch(error => {
                setModalVisible(!modalVisible)
                setAlert({
                    title: 'Error',
                    message: error.message
                });
            });
    };

    const addUser = (user) => {
        const userData = {
            'mapInitialRegion': userLocation,
            'email': user.email
        }
        const userID = user.uid
        db.collection('drivers').doc(userID).set(userData)
    }

    const textChangeHandler = (val) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/

        if (val.trim().length >= 11) {
            if (reg.test(val)) {
                setData({
                    ...data,
                    email: val,
                    check_textInputChange: true,
                    isValidUser: true,
                    isValidEmail: true
                });
            } else {
                setData({
                    ...data,
                    email: val,
                    check_textInputChange: false,
                    isValidUser: true,
                    isValidEmail: false
                });
            }
        } else {
            setData({
                ...data,
                email: val,
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
            if (mediumRegex.test(val)) {
                if (strongRegex.test(val)) {
                    setData({
                        ...data,
                        password: val,
                        isValidPassword: true,
                        isMediumPassword: true,
                        isStrongPassword: true
                    });
                } else {
                    setData({
                        ...data,
                        password: val,
                        isValidPassword: true,
                        isMediumPassword: true,
                        isStrongPassword: false
                    });
                }
            } else {
                setData({
                    ...data,
                    password: val,
                    isValidPassword: true,
                    isMediumPassword: false,
                    isStrongPassword: false
                });
            }
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false,
                isMediumPassword: false,
                isStrongPassword: false
            });
        }
    };

    const confirmPasswordChangeHandler = (value) => {
        let length = value.length
        let password = data.password.slice(0,length)
        if (value == password) {
            setData({
                ...data,
                confirm_password: value,
                isValidConfirmPassword: true
            });
        } else {
            setData({
                ...data,
                confirm_password: value,
                isValidConfirmPassword: false
            });
        }
    };

    const handleVisibility = () => {

        const newPassword = data.password.trim()
        const confirmPassword = data.confirm_password.trim()
        const email = data.email.trim()

        if (email == "" || newPassword == "" || confirmPassword == "") {
            setDisable(true)
        } else {
            setDisable(false)
        }
    };

    return (
        <View style={styles.container}>

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
                        onChangeText={(value) =>{
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
                {
                    data.isValidPassword ? data.isMediumPassword ? null
                        : <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={{ ...FONTS.body4, color: COLORS.sceondary }}>Weak Password</Text>
                        </Animatable.View>
                        : null
                }
                {
                    data.isValidPassword ? data.isMediumPassword ? data.isStrongPassword ? null
                        :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={{ ...FONTS.body4, color: COLORS.primary }}>Medium Password</Text>
                        </Animatable.View>
                        : null : null
                }

                {/* Confirm Password Field */}
                <Text style={[styles.text_footer, { marginTop: 35 }]}>Confirm Password</Text>
                <View style={styles.action}>
                    <Image
                        source={icons.confirm_password}
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
                        secureTextEntry={data.confirm_secureTextEntry}
                        onChangeText={(value) => {
                            confirmPasswordChangeHandler(value)
                            handleVisibility()
                        }}
                        value={data.confirm_password}
                    />
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setData({
                                ...data,
                                confirm_secureTextEntry: !data.confirm_secureTextEntry
                            })
                        }}
                    >
                        <Image
                            source={data?.confirm_secureTextEntry ? icons.disable_eye : icons.eye}
                            resizeMode='contain'
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: 'grey'
                            }}
                        />
                    </TouchableWithoutFeedback>
                </View>
                {data.isValidConfirmPassword ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Both password's does not match.</Text>
                    </Animatable.View>
                }

                {/* Privacy & Policy */}
                <View style={styles.textPrivate}>
                    <Text style={styles.color_textPrivate}>
                        By signing up you agree to our
                    </Text>
                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Terms of service</Text>
                    <Text style={styles.color_textPrivate}>{" "}and</Text>
                    <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Privacy policy</Text>
                </View>

                <View style={styles.button}>
                    <TouchableOpacity
                        style={{ width: '100%' }}
                        onPress={() => handleSignUp()}
                        disabled={disable}
                    >
                        <LinearGradient
                            colors={['#08d4c4', '#01ab9d']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, { color: 'white' }]}>SignUp</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.signIn, {
                            marginTop: 15,
                            borderColor: '#009387',
                            borderWidth: 1
                        }]}
                        onPress={() => navigation.replace('signIn')}
                    >
                        <Text style={[styles.textSign, {
                            color: '#009387'
                        }]}>SignIn</Text>
                    </TouchableOpacity>

                </View>
            </Animatable.View >

            <CustomAlert
                title={alert.title}
                message={alert.message}
                modalVisible={modalVisible}
                setModalVisible={() => setModalVisible(!modalVisible)}
            />
        </View>
    )
}

export default SignUp

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
        flex: Platform.OS === 'ios' ? 3 : 5,
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
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
        alignItems: 'center'
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    errorMsg: {
        ...FONTS.body4,
        color: '#FF0000',
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        color: '#05375a',
        ...FONTS.body4
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
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
});
