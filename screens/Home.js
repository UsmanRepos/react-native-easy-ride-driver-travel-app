import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import { GOOGLE_MAPS_API_KEY } from '@env'
import * as Location from 'expo-location'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { COLORS, FONTS, SIZES, icons, images } from '../constants'
import { RideModal, CustomAlert } from '../components'
import { auth, db } from '../firebase'


const Home = () => {

  const _map = useRef(1)
  const [passengersAround, setPassengersAround] = useState(null)
  const [driver, setDriver] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [rideModal, setRideModal] = useState(false)
  const [alertModal, setAlertModal] = useState(false)
  const [alert, setAlert] = useState({
    title: '',
    message: ''
  });

  const checkPermission = async () => {
    const hasPermission = await Location.requestForegroundPermissionsAsync();
    if (hasPermission.status === 'granted') {
      const permission = await askPermission();
      return permission
    }
    return true
  };

  const askPermission = async () => {
    const permission = await Location.requestForegroundPermissionsAsync()
    return permission.status === 'granted';
  };

  const getLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return;
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      setCurrentLocation({ latitude: latitude, longitude: longitude })
    } catch (err) { }
  }

  const getDriverDetails = () => {
    db.collection("drivers").doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setDriver(doc.data())
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  const setDriverDetails = () => {
    if (driver == null) return;
    db.collection("drivers").doc(auth.currentUser.uid)
      .update({
        mapInitialRegion: currentLocation
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  }

  useEffect(() => {
    checkPermission();
    getLocation()
    getDriverDetails()
  }, [])



  useEffect(() => {
    if( driver == null) return;

    setPassengersAround([])
    db.collection("passengers").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let passenger = doc.data()
        let url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + driver?.mapInitialRegion?.latitude + '%2C' + driver?.mapInitialRegion?.longitude + '&destinations=' + passenger.mapInitialRegion.latitude + '%2C' + passenger.mapInitialRegion.longitude + '&key=' + GOOGLE_MAPS_API_KEY;

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            setPassengersAround((previous) => {
              return [...previous, {
                ...passenger,
                distance: data.rows[0].elements[0].distance,
                duration: data.rows[0].elements[0].duration,
              }]
            })
          })
          .catch(function (error) {
            console.log(error);
          })
      })
    });
  }, [driver])

  useEffect(() => {
    if(driver == null) return;

    if(!driver?.isAvailable){
      setAlertModal(!alertModal)
      setAlert({
        title: "Alert",
        message: "Pay Attention! You have a ride, Let's Go"
      })
    }

  }, [driver])

  // setInterval(getDriverDetails, 3000);
  // setInterval(setDriverDetails, 3000);
  // setInterval(getLocation, 3500)

  const renderMap = () => {
    return (
      <MapView
        ref={_map}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        showsUserLocation={true}
        followsUserLocation={true}
        initialRegion={{ 
          ...currentLocation,
          latitudeDelta: 0.008, 
          longitudeDelta: 0.008 
        }}
      >
        {
          passengersAround?.map((item, index) =>
            <Marker
              key={`passenger-${index}`}
              coordinate={item?.mapInitialRegion}
            >
              <Image
                source={icons.taxi_icon}
                resizeMode="cover"
                style={{
                  width: 25,
                  height: 25
                }}
              />
            </Marker>
          )
        }

      </MapView>
    )
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
    >
      <StatusBar backgroundColor='transparent' style='light' />
      {/* Render Map */}
      {currentLocation && renderMap()}

      <RideModal
        modalVisible={rideModal}
        setModalVisible={setRideModal}
        driver={driver}
      />
      
      <CustomAlert
        title={alert.title}
        message={alert.message}
        modalVisible={alertModal}
        setModalVisible={() => {
          setAlertModal(!alertModal)
          setRideModal(!rideModal)
        }}
      />
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({})