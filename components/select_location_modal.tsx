import React, { useState, useEffect, useCallback } from 'react';
import { Modal, View, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const LocationSelector = ({ visible, onClose, onSelectLocation }) => {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                // city: '',
                // county: '',
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        })();
    }, []);

    const onPressOnMap = (e) => {
        let coords = e.nativeEvent.coordinate; 
        setLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        });
    }

    return (
        <Modal visible={visible} animationType="slide">
            <View style={{ flex: 1 }}>
                {location && (
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={location}
                        onPress={onPressOnMap}
                    >
                        <Marker coordinate={location} />
                    </MapView>
                )}
                <Button title="Select Location" onPress={() => {
                    onSelectLocation(location);
                }} />
                <Button title="Close" onPress={onClose} />
            </View>
        </Modal>
    );
};

export default LocationSelector;
