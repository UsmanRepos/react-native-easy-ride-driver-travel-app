import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase'
import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, FONTS, icons } from '../../constants'


const Welcome = ({ navigation }) => {

    const [visibility, setVisibility] = useState(false)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace('tabs')
            } else {
                setVisibility(true)
            }
        })
        return unsubscribe
    }, []);

    if (visibility) {
        return (
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Animatable.Image
                        animation={'bounceIn'}
                        source={icons.logo}
                        resizeMode='stretch'
                        style={styles.logo}
                    />
                </View>

                {/* Footer */}
                <Animatable.View style={styles.footer}
                    animation='fadeInUpBig'
                >
                    <Text style={styles.title}>Stay connected with everyone!</Text>
                    <Text style={styles.text}>Signin with account</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('signUp')}
                        style={styles.button}
                    >
                        <LinearGradient
                            colors={['#08d4c4', '#01ab9d']}
                            style={styles.signIn}
                        >
                            <Text style={styles.textSign}>Get Started</Text>
                            <Image
                                source={icons.rightArrow}
                                resizeMode='cover'
                                style={{
                                    width: 12,
                                    height: 12,
                                    tintColor: 'white'
                                }}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animatable.View>
            </View >
        );
    } else {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary}/>
            </View>
        );
    }


}

export default Welcome

const { height } = Dimensions.get('screen')
const width_logo = height * 0.28
const height_logo = height * 0.35

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387',
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 30,
        paddingVertical: 50
    },
    logo: {
        width: width_logo,
        height: height_logo,
        tintColor:COLORS.white
    },
    title: {
        color: '#05375a',
        ...FONTS.h1,
        fontSize: 27
    },
    text: {
        color: 'grey',
        marginTop: 5,
        ...FONTS.body3
    },
    button: {
        marginTop: 30,
        alignItems: 'flex-end'
    },
    signIn: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row'
    },
    textSign: {
        color: 'white',
        // fontWeight: 'bold',
        ...FONTS.h3,
        marginRight: 5
    }

})