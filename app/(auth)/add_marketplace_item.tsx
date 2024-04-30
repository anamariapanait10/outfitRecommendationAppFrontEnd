import React, { useState } from 'react';
import { Image, ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { DataStorageSingleton } from './data_storage_singleton';
import { router, useLocalSearchParams } from 'expo-router';
import { ClothingItem } from './cloth_card';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useAuth } from "@clerk/clerk-expo";
import ChooseImageModal from './choose_image_modal';
import * as ImagePicker from "expo-image-picker";
import Colors from "../../constants/Colors";

const UploadMarketplaceItem = () => {
    const [itemDetails, setItemDetails] = useState({
        description: '',
        condition: '',
        size: '',
        brand: '',
        price: '',
        location: '',
        images: null,
    });
    const { id } = useLocalSearchParams();
    const placeholderImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/B8AAwAB/QL8T0LgAAAABJRU5ErkJggg==";
    const [ cloth, setCloth ] = useState(new ClothingItem(0, 0, "", "", "", "", "", "", "", "", placeholderImage));
    const isFocused = useIsFocused();
    const { isLoaded, userId, getToken } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState("");

    const sendImageForProcessing = async (image: any) => {
      setImage(image);
      setModalVisible(false);
    };

    const uploadImage = async (mode: string) => {
        try {
          let result = {};
          if (mode === "gallery") {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
              base64: true,
            });
          } else {
            await ImagePicker.requestCameraPermissionsAsync();
            result = await ImagePicker.launchCameraAsync({
              cameraType: ImagePicker.CameraType.front,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
              base64: true,
            });
          }
          if (!result.canceled) {
            sendImageForProcessing('data:image/jpeg;base64,' + result.assets[0].base64);
          }
        } catch (error: any) {
          alert("Error uploading image: " + error.message);
          setModalVisible(false);
        }
      };
    
    const handleInputChange = (name, value) => {
        setItemDetails({ ...itemDetails, [name]: value });
    };

    const onNavigateToPage = () => {
        if(typeof id == 'string') {
          let ci = DataStorageSingleton.getInstance().clothingItems.find(i => i.id == parseInt(id));  
          if(ci) {
            setCloth(ci);
            DataStorageSingleton.getInstance().clothId = ci.id;
          }
        }
    };
    
    useFocusEffect(
        React.useCallback(() => {
            if (isFocused) {
                onNavigateToPage();
            }
            
        }, [isFocused])
    );

    const handleSubmit = () => {
        const makePostRequest = async () => {
            if (!userId || !isLoaded) {
              console.log("No authenticated user found.");
              return;
            }
            try {
              const token = await getToken();
      
              const requestBody = JSON.stringify({
                // user_id: userId,
                // outfit: cloth.id,
                // description: itemDetails.description,
                // status: "Available",
                // images: itemDetails.images || "",
                // condition: itemDetails.condition,
                // size: itemDetails.size,
                // brand: itemDetails.brand,
                //posted_date: new Date().toISOString(),
                // price: parseFloat(itemDetails.price),
                // location: itemDetails.location,
              });
      
              console.log("POST request body:", requestBody);
      
              const response = await fetch(
                process.env.EXPO_PUBLIC_BASE_API_URL + "/marketplace-items/",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: requestBody
                }
              );
      
              if (response.status !== 200) {
                throw new Error("Something went wrong");
              }
      
              const json = await response.json();
              await DataStorageSingleton.getInstance().fetchClothesData(await getToken(), userId, isLoaded);
              router.replace({pathname: '/(auth)/marketplace'})
            } catch (error) {
              console.error("Error making POST request:", error);
            }
        };
      
        makePostRequest();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={{marginRight: 10, marginLeft: 10}}>
                {/* Image picker */}
                <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.imagePicker, image? styles.imagePickerAfterSelection : styles.imagePickerBeforeSelection]}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                ) : (
                    <Text>Select an Image</Text>
                )}
                </TouchableOpacity>
                <ChooseImageModal
                    modalVisible={modalVisible}
                    onBackPress={() => setModalVisible(false)}
                    onCameraPress={() => uploadImage("camera")}
                    onGalleryPress={() => uploadImage("gallery")}
                />
                <TextInput
                    label="Brand"
                    value={itemDetails.brand}
                    onChangeText={text => handleInputChange('brand', text)}
                    style={styles.input}
                />
                <TextInput
                    label="Condition"
                    value={itemDetails.condition}
                    onChangeText={text => handleInputChange('condition', text)}
                    style={styles.input}
                />
                <TextInput
                    label="Size"
                    value={itemDetails.size}
                    onChangeText={text => handleInputChange('size', text)}
                    style={styles.input}
                />
                <TextInput
                    label="Description"
                    value={itemDetails.description}
                    onChangeText={text => handleInputChange('description', text)}
                    multiline
                    numberOfLines={4}
                    style={styles.input}
                />
                <TextInput
                    label="Price (EUR)"
                    value={itemDetails.price}
                    onChangeText={text => handleInputChange('price', text)}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TextInput
                    label="Location"
                    value={itemDetails.location}
                    onChangeText={text => handleInputChange('location', text)}
                    style={styles.input}
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                    <Text style={styles.saveButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        marginBottom: 5,
        marginVertical: 4,
        height: 50,
        borderRadius: 7,
        backgroundColor: '#fff',
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
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    imagePickerAfterSelection: {
        borderStyle: 'solid',
    },
    imagePickerBeforeSelection: {
        borderStyle: 'dashed',
    },
    saveButton: {
        backgroundColor: Colors.purple,
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 7,
        marginBottom: 20,
    },
    saveButtonText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },
});

export default UploadMarketplaceItem;
