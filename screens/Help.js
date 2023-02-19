import { StyleSheet, Text, View, Linking, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { ProfileValue } from '../components';
import { COLORS, FONTS, SIZES, icons } from '../constants';

const Help = ({ navigation }) => {

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
                    <Text style={{ ...FONTS.h3, color: COLORS.white, fontSize: 18 }}>HelpCenter | Tripak</Text>
                </View>
            </View>
        );
    };

    const renderWelcomeText = () => {
        return (
            <View 
            style={{
                paddingTop:SIZES.padding,
                paddingBottom:SIZES.radius
            }}>
                <Text style={{ ...FONTS.body3 }}>Please feel free to contact us about any queries you may have</Text>
            </View>
        )
    }

    const renderEndingText = () => {
        return (
            <View style={{
                paddingTop:SIZES.padding
            }}>
                <Text style={{...FONTS.body3 }}>Notice a bug on the app or have some feedback ? Let us know and help improve the Multi-Tasker app</Text>
            </View>
        )
    }
    
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
                {renderWelcomeText()}
                <ProfileValue
                    icon={icons.email}
                    label={'Via Email'}
                    containerStyle={styles.profileContainer}
                    onPress={()=>Linking.openURL('mailto:usmanaslam1002@gmail.com')}
                />
                <ProfileValue
                    icon={icons.call}
                    label={'Via Call'}
                    containerStyle={styles.profileContainer}
                    onPress={()=>Linking.openURL(`tel:${"03152331002"}`)}
                />
                {renderEndingText()}
            </ScrollView>
        </View>
    )
}

export default Help

const styles = StyleSheet.create({
    profileContainer: {
        height: 60,
        marginTop: SIZES.radius,
        paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.gray20
    }
})