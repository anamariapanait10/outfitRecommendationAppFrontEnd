import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useAuth } from '@clerk/clerk-expo';
import { router, useFocusEffect } from 'expo-router';
import MarketplaceItemTable from '../../../components/MarketplaceItemTable';
import Colors from "../../../constants/Colors";
import SpinnerOverlay from '../../../components/spinner_overlay';

const MarketplaceScreen = () => {
    const [items, setItems] = useState([]);
    const { isLoaded, userId, getToken } = useAuth();
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            fetchItems();    
        }, [])
    );

    const fetchItems = async () => {
        const makeGetRequest = async () => {
            if (!userId || !isLoaded) {
              console.log("No authenticated user found.");
              return;
            }
            try {
                const token = await getToken();
        
                const response = await fetch(
                    process.env.EXPO_PUBLIC_BASE_API_URL + `/marketplace-items/get_available_items_for_user?userId=${userId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
        
                if (!response.ok) {
                    throw new Error("Something went wrong");
                }
        
                const json = await response.json();
                // console.log("GET request response:", json);
                setItems(json);
            } catch (error) {
                console.error("Error making POST request:", error);
            }
        };
        setLoading(true);
        await makeGetRequest();
        setLoading(false);
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <SpinnerOverlay isVisible={loading} />
            <View style={styles.container}>
                <View style={{width: '65%'}}>
                    <MarketplaceItemTable {...item} />
                </View>
                <View style={styles.info}>
                <Image source={{ uri: item.outfit.image }} style={styles.image} />
                <Card.Actions>
                    <TouchableOpacity style={styles.button} onPress={() => router.push({pathname: '/(auth)/marketplace/marketplace_item_details', params: {id: item.id}})}>
                        <Text style={{color: 'white'}}>View Details</Text>
                    </TouchableOpacity>
                </Card.Actions>
                </View>
            </View>
        </Card>
      );

/*       <View style={{padding: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => setModalVisible(true)} >
                    <Ionicons style={{paddingTop: 1.5, padding: 2, color: Colors.purple}} name="search-outline" size={19}/>
                    <Text style={styles.search_items}> Search for silimar products </Text>
                </TouchableOpacity>
                <ChooseImageModal
                    modalVisible={modalVisible}
                    onBackPress={() => setModalVisible(false)}
                    onCameraPress={() => uploadImage("camera")}
                    onGalleryPress={() => uploadImage("gallery")}
                />
                {image ? (
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                ) : (
                    <Text>Select an Image</Text>
                )}
            </View> */
    return (
        <View>  
            <View style={styles.container}>
                {!items ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 8,
        overflow: 'hidden',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    image: {
        width: 'auto',
        height: 150,
        marginLeft: 10,
        marginTop: 10,
        marginRight: 10,
        borderRadius: 15,
    },
    info: {
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    text: {
        marginBottom: 4,
    },
    button: {
        padding: 10,
        backgroundColor: '#7b68ee',
        color: 'white',
        borderRadius: 5,
        marginTop: 20,
    },
    search_items: {
        color: Colors.purple,
    },
    imagePicker: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300, 
        marginBottom: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#f8f8f8',
        position: 'relative',
    },
    imagePreview: {
        //marginLeft: 40,
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    imagePickerAfterSelection: {
        borderStyle: 'solid',
    },
    imagePickerBeforeSelection: {
        borderStyle: 'dashed',
    },
});

export default MarketplaceScreen;