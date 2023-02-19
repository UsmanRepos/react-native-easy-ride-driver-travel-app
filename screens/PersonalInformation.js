import { StyleSheet, Text, View, TextInput, Modal, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ProfileValue, PersonalInFoModal, CustomAlert } from '../components'
import { COLORS, SIZES, FONTS, icons } from '../constants'
import { useSelector } from 'react-redux'
import { auth, db } from '../firebase'

const PersonalInformation = ({ navigation }) => {
    const { appTheme } = useSelector((state) => state.themeReducer)
    const [alertModal, setAlertModal] = useState(false)
    const [alert, setAlert] = useState({
        title: '',
        message: ''
    });

    const [personalInFo, setPersonalInFo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dob: '',
        homeTown: ''
    });
    const [modalInFo, setModalInFo] = useState({
        title: '',
        description: '',
        fieldName: '',
        displayName: ''
    });
    const [areas, setAreas] = useState([])
    const [validate, setValidate] = useState(true)
    const [selectedArea, setSelectedArea] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [areaCodesModal, setAreaCodesModal] = useState(false)

    useEffect(() => {
        const userID = auth.currentUser.uid
        var docRef = db.collection("drivers").doc(userID);

        docRef.get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                setPersonalInFo({
                    ...userData,
                    firstName: userData.firstName ? userData.firstName : '',
                    lastName: userData.lastName ? userData.lastName : '',
                    phoneNumber: userData.phoneNumber ? userData.phoneNumber : '',
                    dob: userData.dob ? userData.dob : '',
                    homeTown: userData.homeTown ? userData.homeTown : ''
                });
            } else {
                console.log("No such document Exist ...");
            }
        }).catch((error) => {
            console.log("Error getting document: ", error);
        })

    }, []);

    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all")
            .then(response => response.json())
            .then(data => {

                let areaData = data.map((item) => {
                    console.log("areas: ", item.idd.suffixes === undefined ? "" : item.idd.suffixes[0])
                    return {
                        code: item.cca2,
                        name: item.name.common,
                        callingCode: {
                            prefix: item.idd?.root,
                            suffix: item.idd.suffixes === undefined ? "" : item.idd.suffixes[0]
                        },
                        flag: item.flags.png
                    }
                });

                setAreas(areaData);

                if (areaData.length > 0) {
                    let defaultData = areaData.filter(a => a.code == "PK")
                    if (defaultData.length > 0) {
                        setSelectedArea(defaultData[0])
                    }
                };

            }).catch((error) => {
                console.log("Error getting document: ", error);
            })
    }, []);

    const handleSave = () => {
        if (modalInFo.fieldName == "dob") {
            let birthDate = personalInFo.dob.split("/")
            let currentDate = new Date()
            const month = parseInt(currentDate.getMonth() + 1)
            const day = parseInt(currentDate.getDate())
            const year = parseInt((currentDate.getFullYear().toString()).slice(2))

            console.log("CurrentDate", month + "/" + day + "/" + year)
            console.log("birthDate", parseInt(birthDate[0]) + "/" + parseInt(birthDate[1]) + "/" + parseInt(birthDate[2]))

            if ((year < parseInt(birthDate[2]))
                || ((year == parseInt(birthDate[2])) && (month < parseInt(birthDate[0])))
                || ((year == parseInt(birthDate[2])) && (month == parseInt(birthDate[0])) && (day < parseInt(birthDate[1])))
            ) {
                setAlert({
                    title: 'Alert',
                    message: 'Invalid Date\nPlease enter the valid information'
                })
                setAlertModal(true)
            } else {
                const userID = auth.currentUser.uid;
                var citiesRef = db.collection("drivers");
                citiesRef.doc(userID).update(personalInFo);
            }

        } else if (modalInFo.fieldName == "phoneNumber") {
            if (!personalInFo.phoneNumber == 14) {
                setAlert({
                    title: 'Alert',
                    message: 'Invalid Phone Number\nPlease enter the valid information'
                })
                setAlertModal(true)
            } else {
                const userID = auth.currentUser.uid;
                var citiesRef = db.collection("drivers");
                citiesRef.doc(userID).update(personalInFo);
            }
        } else if (modalInFo.fieldName == "email") {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
            if (!reg.test(personalInFo.email)) {
                setAlert({
                    title: 'Alert',
                    message: 'Email address is badly formated'
                })
                setAlertModal(true)
            }
            else {
                const userID = auth.currentUser.uid;
                var citiesRef = db.collection("drivers");
                citiesRef.doc(userID).update(personalInFo);
            }
        } else {
            const userID = auth.currentUser.uid;
            var citiesRef = db.collection("drivers");
            citiesRef.doc(userID).update(personalInFo);
        }
    }

    const renderHeader = () => {
        return (
            <View
                style={{
                    height: 58,
                    marginTop: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.primary
                }}
            >
                {/* Back Button */}
                <TouchableOpacity
                    style={{
                        marginHorizontal: SIZES.radius,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => navigation.goBack()}
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

                {/* Label / Title */}
                <View style={{ flex: 1 }}>
                    <Text style={{ ...FONTS.h3, color: COLORS.white, fontSize: 18 }}>Personal Information</Text>
                </View>
            </View>
        );
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: appTheme?.backgroundColor
            }}
        >

            {/* Header */}
            {renderHeader()}

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    padding: SIZES.radius
                }}
            >
                <ProfileValue
                    icon={icons.profile}
                    label={'Full Name'}
                    value={
                        personalInFo.firstName == ''
                            ? 'Not Provided'
                            : personalInFo.firstName + " " + personalInFo.lastName
                    }
                    containerStyle={styles.profileContainer}
                    onPress={() => {
                        setModalVisible(true)
                        setModalInFo({
                            ...modalInFo,
                            title: 'Update Name',
                            fieldName: 'name',
                            description: 'Please enter the name you\'d like to use with your account.'
                        })
                    }}
                />
                <ProfileValue
                    icon={icons.email}
                    label={'Email'}
                    value={personalInFo.email}
                    containerStyle={styles.profileContainer}
                    onPress={() => {
                        setModalVisible(true)
                        setModalInFo({
                            ...modalInFo,
                            title: 'Update Email',
                            fieldName: 'email',
                            displayName: 'Email'
                        })
                    }}
                />
                <ProfileValue
                    icon={icons.call}
                    label={'Phone Number'}
                    value={personalInFo.phoneNumber == '' ? 'Not Provided' : personalInFo.phoneNumber}
                    containerStyle={styles.profileContainer}
                    onPress={() => {
                        setModalVisible(true)
                        setModalInFo({
                            ...modalInFo,
                            title: 'Update Phone Number',
                            fieldName: 'phoneNumber',
                            displayName: 'Phone Number',
                            description: 'Please enter the mobile number you\'d like to use with your account.'
                        })
                    }}
                />
                <ProfileValue
                    icon={icons.calendar}
                    label={"Date Of Birth"}
                    value={personalInFo.dob == '' ? 'Not Provided' : personalInFo.dob}
                    containerStyle={styles.profileContainer}
                    onPress={() => {
                        setModalVisible(true)
                        setModalInFo({
                            ...modalInFo,
                            title: 'Update Date Of Birth',
                            fieldName: 'dob',
                            displayName: 'Date Of Birth',
                            description: 'Please enter the date of birth you\'d like to use with your account.'
                        })
                    }}
                />
                <ProfileValue
                    icon={icons.home}
                    label={'Home Town'}
                    value={personalInFo.homeTown == '' ? 'Not Provided' : personalInFo.homeTown}
                    containerStyle={styles.profileContainer}
                    onPress={() => {
                        setModalVisible(true)
                        setModalInFo({
                            ...modalInFo,
                            title: 'Update Home Town',
                            fieldName: 'homeTown',
                            displayName: 'Home Town',
                            description: 'Please enter the home town you\'d like to use with your account.'
                        })
                    }}
                />
            </ScrollView>

            <PersonalInFoModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                personalInFo={personalInFo}
                setPersonalInFo={setPersonalInFo}
                modalInFo={modalInFo}
                handleSave={handleSave}
                areas={areas}
                areaCodesModal={areaCodesModal}
                setAreaCodesModal={setAreaCodesModal}
                selectedArea={selectedArea}
                setSelectedArea={setSelectedArea}
            />

            <CustomAlert
                title={alert.title}
                message={alert.message}
                modalVisible={alertModal}
                setModalVisible={() => setAlertModal(!alertModal)}
            />
        </View>
    )
}

export default PersonalInformation

const styles = StyleSheet.create({
    profileContainer: {
        height: 75,
        marginTop: SIZES.radius,
        paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.gray20
    }
})