import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { FONTS, SIZES, COLORS, icons } from '../constants';

const About = ({ navigation }) => {

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
                    <Text style={{ ...FONTS.h3, color: COLORS.white, fontSize: 18 }}>About Us | Tripak</Text>
                </View>
            </View>
        );
    };

    const renderAboutUs = () => {
        return (
            <View
                style={{
                    paddingTop: SIZES.padding
                }}
            >
                <Text style={{ ...FONTS.h2 }}>About Us</Text>
                <Text style={{ ...FONTS.body3, marginVertical:SIZES.base }}>
                    Tripak, a Tripadvisor company, makes it easy to find and book something you'll love to do.
                    With access to the world's largest selection of high-quality experiences, there's always something
                    new to discover, both near and far from home. From must-do moments to who-knew discoveries,
                    see the familiar in a new way, or the unknown for the first time!
                </Text>
            </View>
        )
    };

    const renderWhyChooseTripak = () => {
        return (
            <View>
                <Text style={{ ...FONTS.body2 }}>Why choose Viator?</Text>
                <Text style={{ ...FONTS.body3, marginVertical:SIZES.base }}>
                    <Text style={{ ...FONTS.h3 }}>Exceptional flexibility </Text>
                     You're in control, with free cancellation and payment options to satisfy any plan or budget.
                </Text>
                <Text style={{ ...FONTS.body3 }}>
                    <Text style={{ ...FONTS.h3 }}>Quality you can trust </Text>
                    Our experiences meet high quality standards and are backed by millions of reviews, so you know you're getting the best.
                </Text>
                <Text style={{ ...FONTS.body3, marginVertical:SIZES.base }}>
                    <Text style={{ ...FONTS.h3 }}>Experiences to remember </Text>
                    Browse and book tours and activities so incredible, you'll want to tell your friends.
                </Text>
                <Text style={{ ...FONTS.body3 }}>
                    <Text style={{ ...FONTS.h3 }}>Award-winning support</Text>
                    Find a lower price? Have a change in plans? No problem. We'e here to help, 24/7.
                </Text>
            </View>
        )
    }

    const renderTourOperator = () => {
        return (
            <View>
                <Text style= {{...FONTS.body2, marginVertical:SIZES.base }}>Are you a tour operator?</Text>
                <Text style={{ ...FONTS.body3}}>
                    As one of the first online marketplaces for things to do, Viator makes it easy for you to
                    grow your business and reach customers worldwide. Get access to market-specific insights and
                    tailored coaching to help your products stand out from the rest. Use our intuitive Experiences
                    Management Center to spend less time managing your business and more time creating memorable moments.
                </Text>
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
                    paddingBottom:SIZES.padding
                }}
            >
                {renderAboutUs()}
                {renderWhyChooseTripak()}
                {renderTourOperator()}
            </ScrollView>
        </View>
    )
}

export default About

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