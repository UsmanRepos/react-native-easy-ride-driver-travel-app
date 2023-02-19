import { StyleSheet, Text, View, Modal, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { GOOGLE_MAPS_API_KEY } from '@env'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { FONTS, SIZES, COLORS, icons, images } from '../constants'
import LineDivider from './LineDivider';
import { db, auth } from '../firebase';


const StarReview = ({ rate }) => {
    const starComponents = []
    const fullStar = Math.floor(rate)
    const noStar = Math.floor(5 - rate)
    const halfStar = 5 - fullStar - noStar

    for (let i = 0; i < fullStar; i++) {
        starComponents.push(
            <Image
                key={`full-${i}`}
                source={icons.starFull}
                resizeMode='cover'
                style={{
                    width: 20,
                    height: 20
                }}
            />
        );
    };

    for (let i = 0; i < halfStar; i++) {
        starComponents.push(
            <Image
                key={`half-${i}`}
                source={icons.starHalf}
                resizeMode='cover'
                style={{
                    width: 20,
                    height: 20
                }}
            />
        );
    };

    for (let i = 0; i < noStar; i++) {
        starComponents.push(
            <Image
                key={`half-${i}`}
                source={icons.starEmpty}
                resizeMode='cover'
                style={{
                    width: 20,
                    height: 20
                }}
            />
        );
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {starComponents}
            <Text style={{ marginLeft: SIZES.base, color: COLORS.white }}>{rate}</Text>
        </View>
    );
};

const RideModal = ({
    modalVisible, setModalVisible, driver
}) => {

    const _map = useRef();
    const [fromLocation, setFromLocation] = useState(null);
    const [toLocation, setToLocation] = useState(null);
    const [region, setRegion] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [angle, setAngle] = useState(0);

    const [rideDetails, setRideDetails] = useState(null)
    const [passenger, setPassenger] = useState(null)

    useEffect(() => {
        let rides = []
        db.collection('rides').where('driverID', '==', auth.currentUser.uid).where("status", "==", "upcoming").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                rides.push(doc.data())
            });
            setRideDetails(rides[0])
        })
    }, []);

    useEffect(() => {

        if(!rideDetails) return;
        
        db.collection('passengers').doc(rideDetails?.userID).get()
            .then((doc) => {
                setPassenger(doc.data())
            })

        let fromLoc = {
            latitude: rideDetails?.origin?.location?.lat || 33.6844,
            longitude: rideDetails?.origin?.location?.lng || 73.0479,
        }

        let toLoc = {
            latitude: rideDetails?.destination?.location?.lat || 33.7715,
            longitude: rideDetails?.destination?.location?.lng || 72.7511,
        }

        let mapRegion = {
            latitude: (fromLoc?.latitude + toLoc?.latitude) / 2,
            longitude: (fromLoc?.longitude + toLoc?.longitude) / 2,
            latitudeDelta: Math.abs(fromLoc?.latitude - toLoc?.latitude) * 2,
            longitudeDelta: Math.abs(fromLoc?.longitude - toLoc?.longitude) * 2,
        }

        setToLocation(toLoc);
        setFromLocation(fromLoc);
        setRegion(mapRegion);

    }, [rideDetails])

    useEffect(() => {
        if (!fromLocation || !toLocation) return;

        _map.current?.fitToSuppliedMarkers(["origin", "destination"], {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        });

    }, [fromLocation, toLocation]);

    const getDriverTime = async () => {
        const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + rideDetails?.origin.location.lat + '%2C' + rideDetails?.origin.location.lng + '&destinations=' + driver.mapInitialRegion.latitude + '%2C' + driver.mapInitialRegion.longitude + '&key=' + GOOGLE_MAPS_API_KEY;
        const response = await fetch(url);
        const data = await response.json();
        (data.rows[0].elements[0]);
    };

    const handleCancelingRide =  () => {
        db.collection("rides").doc(rideDetails?.id).update({
            status: "cancelled"
        })
        .then(() => {
            console.log("Document successfully updated!");
            setModalVisible(!modalVisible)
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
    }  

    const calculateAngle = (coordinates) => {
        let startLat = coordinates[0]["latitude"];
        let startLon = coordinates[0]["longitude"];
        let endLat = coordinates[1]["latitude"];
        let endLon = coordinates[1]["longitude"]
        let dx = endLat - startLat;
        let dy = endLon - startLon;

        return Math.atan2(dy, dx) * 180 / Math.PI;
    }

    const RenderMarker = () => {
        return (
            <Marker
                coordinate={toLocation}
                title="Destination"
                description={rideDetails?.destination?.description}
                identifier="destination"

            >
                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: COLORS.white
                    }}
                >
                    <View
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: COLORS.primary
                        }}
                    >
                        <Image
                            source={icons.pin}
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: COLORS.white
                            }}
                        />
                    </View>
                </View>
            </Marker>
        )
    }

    const RenderCarIcon = () => {
        return (
            <Marker
                coordinate={fromLocation}
                title="Origin"
                description={rideDetails?.origin?.description}
                identifier="origin"
                anchor={{ x: 0.5, y: 0.5 }}
                flat={true}
                rotation={angle}
            >
                <Image
                    source={icons.car}
                    style={{
                        width: 40,
                        height: 40
                    }}
                />

            </Marker>
        )
    }

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <MapView
                        ref={_map}
                        style={{ flex: 1 }}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={region}
                        showsCompass={true}
                        showsMyLocationButton={true}
                        showsScale={true}
                    >
                        {fromLocation && toLocation &&
                            <MapViewDirections
                                origin={fromLocation}
                                destination={toLocation}
                                apikey={GOOGLE_MAPS_API_KEY}
                                strokeWidth={3}
                                strokeColor="blue"
                                lineDashPattern={[0]}
                                optimizeWaypoints={true}
                                onReady={result => {
                                    //Fit Route Into Map
                                    if (!isReady) {
                                        _map.current.fitToCoordinates(result.coordinates, {
                                            edgePadding: {
                                                right: (SIZES.width / 20),
                                                bottom: (SIZES.height / 4),
                                                left: (SIZES.width / 20),
                                                top: (SIZES.height / 8)
                                            }
                                        })
                                    }
                                    //Repositioning The Car
                                    let nextLoc = {
                                        latitude: (result.coordinates[0]["latitude"]),
                                        longitude: (result.coordinates[0]["longitude"])
                                    }

                                    if (result.coordinates.length > 2) {
                                        let angle = calculateAngle(result.coordinates);
                                        setAngle(angle);
                                    }
                                    setFromLocation(nextLoc);
                                    setIsReady(true);
                                }}
                            />
                        }
                        {fromLocation && <RenderCarIcon />}
                        {toLocation && <RenderMarker />}
                    </MapView>
                </View>
                <View style={styles.footer}>
                    <View
                        style={{
                            flex: .2,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: SIZES.radius,
                            borderBottomColor: COLORS.transparentBlack4,
                            borderBottomWidth: 1
                        }}
                    >
                        <Text style={{ ...FONTS.h3, textAlign: 'center', flex: 1 }}>Your passenger is 12 mins away from you</Text>
                    </View>
                    <View
                        style={{ flex: .7 }}
                    >
                        <View style={{ marginTop: SIZES.radius, width: SIZES.width * .94 }}>
                            <View
                                style={{
                                    marginTop: SIZES.radius,
                                    paddingHorizontal: SIZES.base,
                                    paddingVertical: SIZES.radius,
                                    borderRadius: SIZES.radius,
                                    backgroundColor: COLORS.white
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Image
                                        source={images.banner}
                                        resizeMode='contain'
                                        style={{
                                            width: 45,
                                            height: 45,
                                            borderRadius: SIZES.radius
                                        }}
                                    />
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginLeft: SIZES.base
                                        }}
                                    >
                                        <View style={{ justifyContent: 'center'}}>
                                            <Text style={{ ...FONTS.h3, fontSize: 18 }}>{`${passenger?.firstName} ${passenger?.lastName}` ?? "..."}</Text>
                                            <StarReview rate={4.5} />
                                        </View>
                                        <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <Text style={{ ...FONTS.body3 }} >{`+92 ${passenger?.phoneNumber}` ?? "..."}</Text>
                                            <Text style={{ ...FONTS.body3 }}>{passenger?.homeTown ?? "..."}</Text>
                                        </View>
                                    </View>
                                </View>

                                <LineDivider lineStyle={{ marginVertical: SIZES.radius }} />
                                <View>

                                    <View
                                        style={{ flexDirection: 'row' }}
                                    >
                                        <View
                                            style={{
                                                width: 50,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <View
                                                style={{
                                                    padding: SIZES.base,
                                                    borderRadius: SIZES.radius,
                                                    backgroundColor: COLORS.lightyellow
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: 15,
                                                        height: 15,
                                                        backgroundColor: COLORS.sceondary,
                                                        borderRadius: SIZES.radius
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ ...FONTS.body4 }}>{rideDetails?.origin?.description ?? "..."}</Text>
                                            {/* <Text style={{ ...FONTS.h4, color: COLORS.gray30 }}>{rideDetails?.bookingTime ?? "..."}</Text> */}
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: 5,
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 50,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: SIZES.radius,
                                                    height: SIZES.radius,
                                                    backgroundColor: COLORS.sceondary,
                                                    borderRadius: 8
                                                }}
                                            />
                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ ...FONTS.body4 }}>{rideDetails?.destination?.description ?? "..."}</Text>
                                            {/* <Text style={{ ...FONTS.h4, color: COLORS.gray30 }}>{`${rideDetails?.duration?.text} take to reach`}</Text> */}
                                        </View>
                                    </View>

                                    {/* Vertical Line */}
                                    {/* <View
                                        style={{
                                            position: 'absolute',
                                            bottom: '13%', left: '6.5%',
                                            width: 4,
                                            height: 30,
                                            backgroundColor: COLORS.sceondary
                                        }}
                                    >
                                    </View> */}
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: .25, paddingHorizontal: SIZES.base, marginTop: SIZES.base }}>
                        <LinearGradient
                            style={{ width: '100%', height: '80%', borderRadius: 15, marginTop: SIZES.base }}
                            colors={[COLORS.sceondary, COLORS.primary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, marginHorizontal: SIZES.padding, justifyContent: 'center' }}>
                                    <Text style={{ ...FONTS.h3 }}>Ride</Text>
                                </View>
                                <TouchableOpacity
                                    style={{ width: 130, height: '80%', marginHorizontal: SIZES.radius }}
                                    onPress={() => handleCancelingRide()}
                                >
                                    <LinearGradient
                                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}
                                        colors={[COLORS.white, COLORS.transparentWhite4]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        <Text style={{ ...FONTS.h3 }}>Cancel</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            </View>
        </Modal >
    )
}

export default RideModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    header: {
        flex: 5,
        marginBottom: -SIZES.base
    },
    footer: {
        flex: 4,
        backgroundColor: '#fff',
        borderTopLeftRadius: SIZES.radius,
        borderTopRightRadius: SIZES.radius,
    }
})