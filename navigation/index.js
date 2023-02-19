import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, FONTS, SIZES, icons } from '../constants'
import { Welcome, SignIn, SignUp, Home, History,
 AccountInformation, ManagePrivacy, PersonalInformation, About, Help, Profile } from '../screens'

 const AuthStack = createStackNavigator()
 const MainStack = createStackNavigator()
 const RootStack = createStackNavigator()
 const Tabs = createBottomTabNavigator()

const AuthStackScreen = () => (
    <AuthStack.Navigator
        initialRouteName='welcome'
        headerMode='none'
    >
        <AuthStack.Screen
            name='welcome'
            component={Welcome}
        />
        <AuthStack.Screen
            name='signIn'
            component={SignIn}
        />
        <AuthStack.Screen
            name='signUp'
            component={SignUp}  
        />
    </AuthStack.Navigator>
);

const tabBarOptions = {
    showLabel: false,
    style: {
        position: 'absolute',
        left: SIZES.padding,
        right: SIZES.padding,
        bottom: SIZES.radius,
        height: 60,
        elevation: 0,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary
    }
}

const TabBarIcon = ({ icon, tintColor }) => (
    <View
        style={{
            justifyContent: "center",
            alignItems: "center"
        }}
    >
        <Image
            source={icon}
            resizeMode="contain"
            style={{
                width: 25,
                height: 25,
                tintColor: tintColor
            }}
        />
    </View>
);

const TabBarButton = ({ children, onPress }) => {
    return (
        <TouchableOpacity
            style={[{
                top: -25,
                justifyContent: 'center',
                alignItems: 'center',
            }, styles.shadow]}
            onPress={onPress}
        >
            <LinearGradient
                colors={[COLORS.primary, COLORS.sceondary]}
                style={{
                    width: 65,
                    height: 65,
                    borderRadius: 35
                }}
            >
                {children}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const TabsScreen = () => (
    <Tabs.Navigator
        tabBarOptions={tabBarOptions}
        initialRouteName='home'
    >
        <Tabs.Screen
            name='home'
            component={Home}
            options={{
                tabBarIcon: ({ focused }) => {
                    let tintColor = focused ? COLORS.sceondary : COLORS.white
                    return (
                        <TabBarIcon icon={icons.home} tintColor={tintColor} />
                    )
                }
            }}
        />

        <Tabs.Screen
            name='history'
            component={History}
            options={{
                tabBarIcon: ({ focused }) => {
                    let tintColor = focused ? COLORS.sceondary : COLORS.white
                    return (
                        <TabBarIcon icon={icons.car} tintColor={tintColor} />
                    )
                }
            }}
        />

        <Tabs.Screen
            name='profile'
            component={Profile}
            options={{
                tabBarIcon: ({ focused }) => {
                    let tintColor = focused ? COLORS.sceondary : COLORS.white
                    return (
                        <TabBarIcon icon={icons.user} tintColor={tintColor} />
                    )
                },
            }}
        />
    </Tabs.Navigator>
);

const MainStackScreen = () => {
    return (
        <MainStack.Navigator
            headerMode='none'
            screenOptions={{
                useNativeDriver:true,
            }}
            
        >
            <MainStack.Screen
                name='tabs'
                component={TabsScreen}
            />
             
            <MainStack.Screen
                name='personalInformation'
                component={PersonalInformation}
                options={{
                    title: 'Personal Information'
                }}
            />
            <MainStack.Screen
                name='accountInformation'
                component={AccountInformation}
                options={{
                    title: 'Account Information'
                }}
            />
            <MainStack.Screen
                name='help'
                component={Help}
                options={{
                    title: 'HelpCenter | EasyRide'
                }}
            />
            <MainStack.Screen
                name='about'
                component={About}
                options={{
                    title: 'AboutUs | EasyRide'
                }}
            />
            <MainStack.Screen
                name='managePrivacy'
                component={ManagePrivacy}
                options={{
                    title: 'Manage Privacy'
                }}
            />
        </MainStack.Navigator>
    );
};


const RootStackScreen = () => {
    return (
        <RootStack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={'authentication'}
        >
            <RootStack.Screen
                name='authentication'
                component={AuthStackScreen}
            />
            <RootStack.Screen
                name='tabs'
                component={MainStackScreen}
            />
        </RootStack.Navigator>
    );
};


const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: COLORS.transparent
    }
};

const Index = () => {
    return (
        <NavigationContainer theme={theme}>
            <RootStackScreen />
        </NavigationContainer>
    );
};

export default Index

const styles = StyleSheet.create({
    shadow: {
        shadowColor: COLORS.sceondary,
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 8
    }
})