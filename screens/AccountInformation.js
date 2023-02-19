import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import { auth } from '../firebase'
import { ProfileValue, CustomAlert } from '../components'
import { COLORS, SIZES, FONTS, icons } from '../constants'

const AccountInformation = ({ navigation }) => {

    const [modalVisible, setModalVisible] = useState(false)
    const [alert, setAlert] = useState({
        title: '',
        message: ''
    });

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
                    <Text style={{ ...FONTS.h3, color: COLORS.white, fontSize: 18 }}>Account Information</Text>
                </View>
            </View>
        );
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            {/* Header */}
            {renderHeader()}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: SIZES.radius,
                }}
            >
                <ProfileValue
                    icon={icons.account}
                    label={'Deactivate your account'}
                    containerStyle={styles.profileContainer}
                    onPress={() => {
                        console.log("Enter ..")
                        const user = auth.currentUser;
                        user.delete().then(() => {
                            setAlert({
                                title: "Alert",
                                message: "Success, User deleted successfully!"
                            })
                            setModalVisible(!modalVisible)
                        }).catch((error) => {
                            setAlert({
                                title: "Alert",
                                message: "Failure, There is an error in deleting the user!"
                            })
                            setModalVisible(!modalVisible)
                        });
                        console.log("Leave ..")
                    }}
                />
                <Text style={{ textAlign: 'left', marginTop: SIZES.radius, ...FONTS.body3 }}>
                    Deactivating your account means that your account will no longer be
                    available. You will not be able to log in and your profile will not
                    be accessible. Any reviews, photos, and tips that you have contributed
                    may continue to be displayed on the site.
                </Text>
            </ScrollView>
            <CustomAlert
                title={alert.title}
                message={alert.message}
                modalVisible={modalVisible}
                setModalVisible={() => setModalVisible(!modalVisible)}
            />
        </View>
    )
}

export default AccountInformation

const styles = StyleSheet.create({
    profileContainer: {
        height: 60,
        marginTop: SIZES.padding,
        paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.gray20
    }
})