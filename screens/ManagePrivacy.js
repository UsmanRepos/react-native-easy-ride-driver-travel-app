import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES, FONTS, icons } from '../constants'
import { CustomRadioButton } from '../components'

const ManagePrivacy = ({navigation}) => {
    const [subscription, setSubscription] = useState(false)
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
                            tintColor:COLORS.white
                        }}
                    />
                </TouchableOpacity>

                {/* Label / Title */}
                <View style={{ flex: 1 }}>
                    <Text style={{ ...FONTS.h3, color: COLORS.white, fontSize: 18 }}>Manage Privacy</Text>
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
                style={{ flex:1 }}
                contentContainerStyle={{
                    paddingTop: SIZES.padding,
                    paddingHorizontal: SIZES.radius,
                }}
            >
                <Text style={{ textAlign: 'left', ...FONTS.body3 }}>
                    By using our app, you agree to the usage by us and our trusted
                    third-party parterns of cookies and other technologies to enhance site
                    security, to improve and personalise your experience as well as
                    delivering tailored ads on our own and other sites.
                </Text>
                <Text style={{ marginTop: SIZES.padding, textAlign: 'left', ...FONTS.body3 }}>
                    For additional details and information about your rights view our
                    <Text style={{ color: COLORS.primary, textDecorationLine: 'underline', marginHorizontal:5 }}> terms of use </Text>
                    and our
                    <Text style={{ color: COLORS.primary, textDecorationLine: 'underline' }} > Privacy and Cookie Statement </Text>
                    .
                </Text>
                <View style={{ marginTop: SIZES.padding, flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingRight: SIZES.radius }}>
                        <Text style={{ ...FONTS.body3 }}>Subscribe to marketing</Text>
                        <Text style={{ ...FONTS.body3 }}>
                            Emails, Travel inspiration, tips, recommendations and company updates
                        </Text>
                    </View>
                    <CustomRadioButton
                        isSelected={subscription}
                        onPress={() => setSubscription(!subscription)}
                    />
                </View>
            </ScrollView>

        </View>
    )
}

export default ManagePrivacy

const styles = StyleSheet.create({})