import { Modal, StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'
import { AreaCodesModal } from '../components'
import { COLORS, SIZES, FONTS, icons } from '../constants'

const PersonalInFoModal = ({
    modalVisible, setModalVisible, personalInFo, setPersonalInFo,
    modalInFo, handleSave, selectedArea, setSelectedArea, areas, areaCodesModal, setAreaCodesModal
}) => {

    const [disable, setDisable] = useState(true)
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const handleVisibility = () => {
        if (modalInFo.fieldName == "name") {
            if (personalInFo.firstName == "" || personalInFo.lastName == "") {
                setDisable(true);
            } else {
                setDisable(false)
            }

        } else {
            const currentField = personalInFo[modalInFo.fieldName]
            if (currentField == "") {
                setDisable(true);
            } else {
                setDisable(false)
            }
        }
    };
    
    return (
        <>
            <Modal
                animationType='fade'
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.text_header}>{modalInFo.title}</Text>
                    </View>

                    {/* Footer */}
                    <Animatable.View
                        style={styles.footer}
                        animation='fadeInUpBig'
                    >
                        {
                            modalInFo.description == '' ? null :
                                <Text style={[styles.text_footer, { marginBottom: 25 }]}>{modalInFo.description}</Text>
                        }
                        {
                            modalInFo.fieldName == "name" &&
                            <View>
                                < Text style={styles.text_footer}>First Name</Text>
                                <View style={styles.action}>
                                    <Image
                                        source={icons.profile}
                                        resizeMode='contain'
                                        style={{
                                            width: 20,
                                            height: 20,
                                            tintColor: '#05375a'
                                        }}
                                    />
                                    <TextInput
                                        placeholder='Your First Name'
                                        style={styles.textInput}
                                        onChangeText={(value) => {
                                            setPersonalInFo({
                                                ...personalInFo,
                                                "firstName": value
                                            })
                                            handleVisibility()
                                        }}
                                        value={personalInFo.firstName}
                                    />
                                </View>

                                < Text style={[styles.text_footer, { marginTop: 35 }]}>Last Name</Text>
                                <View style={styles.action}>
                                    <Image
                                        source={icons.profile}
                                        resizeMode='contain'
                                        style={{
                                            width: 20,
                                            height: 20,
                                            tintColor: '#05375a'
                                        }}
                                    />
                                    <TextInput
                                        placeholder='Your Last Name'
                                        style={styles.textInput}
                                        onChangeText={(value) => {
                                            setPersonalInFo({
                                                ...personalInFo,
                                                "lastName": value
                                            })
                                            handleVisibility()
                                        }}
                                        value={personalInFo.lastName}
                                    />
                                </View>
                            </View>
                        }
                        {
                            modalInFo.fieldName == "email" &&
                            <>
                                < Text style={styles.text_footer}>{modalInFo.displayName}</Text>
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
                                            setPersonalInFo({
                                                ...personalInFo,
                                                "email": value
                                            })
                                            handleVisibility()
                                        }}
                                        value={personalInFo.email}
                                    />
                                </View>
                            </>

                        }
                        {
                            modalInFo.fieldName == "phoneNumber" &&
                            <View>
                                < Text style={styles.text_footer}>{modalInFo.displayName}</Text>
                                <View style={[styles.action, { borderBottomWidth: 0, paddingBottom: 0 }]}>

                                    <TouchableOpacity
                                        style={{
                                            width: 100,
                                            height: 50,
                                            flexDirection: "row",
                                            marginHorizontal: 5,
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#f2f2f2',
                                            ...FONTS.body2
                                        }}
                                        onPress={() => setAreaCodesModal(!areaCodesModal)}
                                    >
                                        <View style={{ justifyContent: "center" }}>
                                            <Image
                                                source={icons.downArrow}
                                                resizeMode='contain'
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    tintColor: COLORS.gray30
                                                }}
                                            />
                                        </View>
                                        <View style={{ justifyContent: "center", marginLeft: 5 }}>
                                            <Image
                                                source={{ uri: selectedArea?.flag }}
                                                resizeMode='contain'
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                }}
                                            />
                                        </View>
                                        <View style={{ justifyContent: "center", marginLeft: 5 }}>
                                            <Text style={{ color: '#05375a', ...FONTS.body3 }}>{(selectedArea?.callingCode?.prefix) + selectedArea?.callingCode?.suffix}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TextInput
                                        placeholder='Your Phone Number'
                                        style={[styles.textInput, { borderBottomWidth: 1, borderBottomColor: '#f2f2f2', }]}
                                        onChangeText={(value) => {
                                            setPersonalInFo({
                                                ...personalInFo,
                                                "phoneNumber": value
                                            })
                                            handleVisibility()
                                        }}
                                        value={personalInFo.phoneNumber}
                                        keyboardType='phone-pad'
                                    />
                                </View>
                            </View>

                        }
                        {
                            modalInFo.fieldName == "dob" &&
                            <>
                                < Text style={styles.text_footer}>{modalInFo.displayName}</Text>
                                <TouchableOpacity 
                                    style={styles.action}
                                    onPress= {() => setShowDatePicker(true)}    
                                >
                                    <Image
                                        source={icons.calendar}
                                        resizeMode='contain'
                                        style={{
                                            width: 20,
                                            height: 20,
                                            tintColor: '#05375a'
                                        }}
                                    />
                                    <TextInput
                                        editable={false}
                                        placeholder='Your Date Of Birth'
                                        style={styles.textInput}
                                        value={personalInFo.dob}
                                    />
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        testID="datePicker"
                                        value={date}
                                        onChange={(event, selectedDate) => {
                                            setPersonalInFo({
                                                ...personalInFo,
                                                "dob": selectedDate.toLocaleDateString()
                                            })
                                            setShowDatePicker(false)
                                            setDate(selectedDate)
                                            handleVisibility()
                                        }}  
                                    />
                                )}
                            </>
                        }
                        {
                            modalInFo.fieldName == "homeTown" &&
                            <>
                                < Text style={styles.text_footer}>{modalInFo.displayName}</Text>
                                <View style={styles.action}>
                                    <Image
                                        source={icons.home}
                                        resizeMode='contain'
                                        style={{
                                            width: 20,
                                            height: 20,
                                            tintColor: '#05375a'
                                        }}
                                    />
                                    <TextInput
                                        placeholder='Your Home Town'
                                        style={styles.textInput}
                                        onChangeText={(value) => {
                                            setPersonalInFo({
                                                ...personalInFo,
                                                "homeTown": value
                                            })
                                            handleVisibility()
                                        }}
                                        value={personalInFo.homeTown}
                                    />
                                </View>
                            </>
                        }

                        {/* Buttons */}
                        <View style={styles.button}>
                            <TouchableOpacity
                                disabled={disable}
                                style={{ width: '100%' }}
                                onPress={() => {
                                    setModalVisible(!modalVisible)
                                    handleSave()
                                }}
                            >
                                <LinearGradient
                                    colors={['#08d4c4', '#01ab9d']}
                                    style={styles.save}
                                >
                                    <Text style={[styles.textSave, { color: 'white' }]}>Save</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.save, {
                                    marginTop: 15,
                                    borderColor: '#009387',
                                    borderWidth: 1
                                }]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={[styles.textSave, {
                                    color: '#009387'
                                }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                </View>
            </Modal >
            <AreaCodesModal
                areas={areas}
                modalVisible={areaCodesModal}
                setModalVisible={setAreaCodesModal}
                setSelectedArea={setSelectedArea}
            />

        </>
    )
}

export default PersonalInFoModal


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
        ...FONTS.body3
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    save: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSave: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});



