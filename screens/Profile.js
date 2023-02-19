import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  IconButton, LineDivider, TextButton, ProfileValue, TextIconButton,
  CustomAlert, PasswordUpdateModal, CustomAlertV2
} from '../components'
import { COLORS, SIZES, FONTS, icons } from '../constants'
// import * as ImagePicker from 'expo-image-picker'
import { useSelector } from 'react-redux'
import { auth, db, sg } from '../firebase';

const Profile = ({ navigation }) => {
  const { appTheme } = useSelector((state) => state.themeReducer)

  const [data, setData] = useState({
    name: "",
    email: "",
    newPassword: "",
    currentPassword: "",
    current_secureTextEntry: true,
    new_secureTextEntry: true,
    isValidOldPassword: true,
    isValidPassword: true,
    isMediumPassword: true,
    isStrongPassword: true
  });

  const [alert, setAlert] = useState({
    title: '',
    message: ''
  });
  const [updatePasswordModal, setUpdatePasswordModal] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [logOutModal, setLogOutModal] = useState(false)

  const [imageUri, setImageUri] = useState(null);
  const [hasGalleryPermissions, setHasGalleryPermissions] = useState(false)

  useEffect(() => {
    const userID = auth?.currentUser?.uid
    var docRef = db.collection("drivers").doc(userID);

    docRef.get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        setData({
          ...data,
          ...userData,
          email: userData.email ?? '',
          firstName: userData.firstName ?? '',
          lastName: userData.lastName ?? '',
        });
      } else {
        console.log("No such document Exist ...");
      }
    }).catch((error) => {
      console.log("Error getting document: ", error);
    })
  }, [navigation])

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermissions(galleryStatus.granted)
    })()
  }, [])

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => { navigation.replace('authentication') })
      .catch(error => alert(error.message))
  };

  const handleUpdatePassword = () => {
    auth
      .signInWithEmailAndPassword(data.email, data.currentPassword)
      .then(userCredentials => {
        userCredentials.user.updatePassword(data.newPassword).then(() => {
          setData({
            name: "",
            email: "",
            newPassword: "",
            currentPassword: "",
            current_secureTextEntry: true,
            new_secureTextEntry: true,
            isValidOldPassword: true,
            isValidPassword: true,
            isMediumPassword: true,
            isStrongPassword: true
          });
          setUpdatePasswordModal(!updatePasswordModal)
        })
          .catch((error) => {
            setModalVisible(!modalVisible)
            setAlert({
              title: 'Error',
              message: error.message
            });
          });
      })
      .catch((error) => {
        setModalVisible(!modalVisible)
        setAlert({
          title: 'Error',
          message: error.message
        });
      });
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (!result.cancelled) {
        const uri = result.uri
        setImageUri(uri);
        console.log(uri)
        const storageRef = sg.ref(auth.currentUser.uid);
        const uploadTask = storageRef.put(uri);

        uploadTask.on('state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done')
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log('File available at', downloadURL);
            });
          }
        );

        try {
          await uploadTask;
        } catch (e) {
          console.log(e);
        }
      }
    } catch (error) {
      console.log(error);
    }

  };

  const renderHeader = () => {
    return (
      <View
        style={{
          height: 58,
          marginTop: 30,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: SIZES.radius,
          backgroundColor: COLORS.primary
        }}
      >
        <Text style={{ ...FONTS.h1, color: COLORS.white, fontSize: 26 }}>Profile</Text>
        <IconButton
          icon={icons.question}
          iconStyle={{
            width: 17,
            height: 17
          }}
          containerStyle={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: COLORS.sceondary
          }}
          onPress={() => console.log('pressed')}
        />
      </View>
    );
  };

  const renderProfileCard = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 20,
          paddingHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
          marginTop: SIZES.padding,
          backgroundColor: COLORS.primary
        }}
      >
        {/* Profile Image */}
        <View
          style={{
            width: 80,
            height: 80,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 40,
            backgroundColor: COLORS.white
          }}
        >
          {
            imageUri ?
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: 200,
                  height: 300,
                  borderRadius: 40
                }}
              /> :
              <Image
                source={icons.profile}
                resizeMode='contain'
                style={{
                  width: 40,
                  height: 40,
                  borderWidth: 1,
                  borderColor: COLORS.white,
                  tintColor: COLORS.sceondary
                }}
              />}
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <IconButton
              icon={icons.camera}
              containerStyle={{
                width: 30,
                height: 30,
                marginBottom: -10,
                borderRadius: 15,
                backgroundColor: COLORS.sceondary
              }}
              iconStyle={{
                width: 17,
                height: 17
              }}
              onPress={() => {
                if (hasGalleryPermissions) {
                  pickImage()
                } else {
                  <Text>Need permissions</Text>
                }
              }}
            />
          </View>
        </View>

        {/* Details */}
        <View
          style={{
            flex: 1,
            marginLeft: SIZES.radius,
            alignItems: 'flex-start'
          }}
        >
          {/* Title */}
          <Text style={{ color: COLORS.white, ...FONTS.h3 }}>{data.firstName + " " + data.lastName}</Text>
          <Text style={{ color: COLORS.white, ...FONTS.body4 }}>{data.email}</Text>

          {/* Member Button */}
          <TextButton
            label={'+ Become Memeber'}
            containerStyle={{
              height: 35,
              marginTop: SIZES.radius,
              paddingHorizontal: SIZES.radius,
              backgroundColor: COLORS.white
            }}
            labelStyle={{
              color: COLORS.sceondary
            }}
          />
        </View>
      </View>
    );
  };

  const renderAccountPreferences = () => {
    return (
      <View style={styles.profileContainer}>
        <TouchableOpacity
          style={{
            height: 60,
            alignItems: 'center',
            flexDirection: 'row'
          }}
        >
          <Text style={{ flex: 1, ...FONTS.body3, color: appTheme?.textColor }}>Currency</Text>
          <TextIconButton
            label={"PKR (Rs)"}
            labelStyle={{
              color: COLORS.gray30,
            }}
            icon={icons.rightArrow}
            iconStyle={{
              width: 15,
              height: 15,
              tintColor: COLORS.gray50
            }}
            containerStyle={{
              backgroundColor: appTheme?.backgroundColor
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderAccountSettings = () => {
    return (
      <View style={styles.profileContainer}>
        <ProfileValue
          label={'Personal Information'}
          containerStyle={{
            height: 60,
            borderWidth: 0
          }}
          onPress={() => navigation.navigate('personalInformation')}
        />
        <LineDivider />

        <ProfileValue
          label={"Acount Information"}
          containerStyle={{
            height: 60,
            borderWidth: 0
          }}
          onPress={() => navigation.navigate('accountInformation')}
        />
        <LineDivider />

        <ProfileValue
          label={"Manage Privacy"}
          containerStyle={{
            height: 60,
            borderWidth: 0
          }}
          onPress={() => navigation.navigate('managePrivacy')}
        />
      </View>
    );
  };

  const renderAccountSupport = () => {
    return (
      <View style={styles.profileContainer}>
        <ProfileValue
          label={'Help'}
          containerStyle={{
            height: 60,
            borderWidth: 0
          }}
          onPress={() => navigation.navigate('help')}
        />
        <LineDivider />

        <ProfileValue
          label={"About EasyRide"}
          containerStyle={{
            height: 60,
            borderWidth: 0
          }}
          onPress={() => navigation.navigate('about')}
        />
      </View>
    );
  };

  const renderAccountLogout = () => {
    return (
      <View style={styles.profileContainer}>
        <ProfileValue
          label={'Update Password'}
          containerStyle={{
            height: 60,
            borderWidth: 0
          }}
          onPress={() => setUpdatePasswordModal(!updatePasswordModal)}
        />

        <LineDivider />

        <ProfileValue
          label={'LogOut'}
          containerStyle={{
            height: 60,
            borderWidth: 0
          }}
          onPress={() => {
            setLogOutModal(!logOutModal)
            setAlert({
              title: 'Alert',
              message: 'Are you sure, You want to Log Out'
            });
          }}
        />
      </View>
    );
  };

  function renderFooter() {
    return (
      <View style={{
        position: 'absolute',
        bottom: '3%',
        left: 0,
        right: 0,
        height: SIZES.height * 0.2,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.height > 700 ? SIZES.padding : 20
      }}>
        <View
          style={{
            width: "100%",
            flexDirection: 'row',
            height: 55
          }}>
          <TextButton
            label='Join Now'
            containerStyle={{
              flex: 1,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.sceondary

            }}
            labelStyle={{
              color: COLORS.white,
            }}
            onPress={() => {
              navigation.replace('authentication', {
                screen: 'signUp',
              })
            }}
          />
          <TextButton
            label='Log In'
            containerStyle={{
              flex: 1,
              borderRadius: SIZES.radius,
              marginLeft: SIZES.radius,
              backgroundColor: COLORS.primary
            }}
            labelStyle={{
              color: COLORS.white
            }}
            onPress={() => {
              navigation.replace('authentication', {
                screen: 'signIn',
              })
            }}
          />
        </View>

      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: appTheme?.backgroundColor }}>

      <StatusBar backgroundColor='#009387' style='light' />
      {/* Header */}
      {renderHeader()}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: SIZES.padding,
          paddingBottom: 105
        }}
      >
        {/* Profile Card */}
        {renderProfileCard()}

        {/* Profile Preferences */}
        {renderAccountPreferences()}

        {/* Profile Setting Portion */}
        {auth.currentUser && renderAccountSettings()}

        {/* Application Support Portion */}
        {renderAccountSupport()}

        {/* Application Logout Portion */}
        {auth.currentUser && renderAccountLogout()}

      </ScrollView>

      {/* Footer */}
      {auth.currentUser == null && renderFooter()}
      <CustomAlert
        title={alert.title}
        message={alert.message}
        modalVisible={modalVisible}
        setModalVisible={() => setModalVisible(!modalVisible)}
      />

      <CustomAlertV2
        title={alert.title}
        message={alert.message}
        modalVisible={logOutModal}
        setModalVisible={() => setLogOutModal(!logOutModal)}
        handleSignOut={handleSignOut}
      />
      <PasswordUpdateModal
        userInFo={data}
        setUserInFo={setData}
        modalVisible={updatePasswordModal}
        setModalVisible={() => setUpdatePasswordModal(!updatePasswordModal)}
        handleUpdatePassword={handleUpdatePassword}
      />
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  profileContainer: {
    marginTop: SIZES.padding,
    paddingHorizontal: SIZES.radius,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.gray20
  }
})