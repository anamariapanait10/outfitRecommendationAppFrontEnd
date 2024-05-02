import React, { useState } from 'react';
import { Image, ScrollView, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { DataStorageSingleton } from '../../../../constants/data_storage_singleton';
import { router, useLocalSearchParams } from 'expo-router';
import { ClothingItem } from '../../../../components/cloth_card';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useAuth } from "@clerk/clerk-expo";
import ChooseImageModal from '../../../../components/choose_image_modal';
import * as ImagePicker from "expo-image-picker";
import Colors from "../../../../constants/Colors";
import ToggleButton from "../../../../components/ToggleButton"
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

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
    const [image, setImage] = useState("");
    
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const conditions = ['Poor', 'Good', 'Like new', 'New'];

    const handleInputChange = (name, value) => {
        setItemDetails({ ...itemDetails, [name]: value });
    };

    const onNavigateToPage = () => {
        if(typeof id == 'string') {
          let ci = DataStorageSingleton.getInstance().clothingItems.find(i => i.id == parseInt(id));  
          if(ci) {
            setCloth(ci);
            setImage(ci.image);
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
                user_id: userId,
                outfit: cloth.id,
                description: itemDetails.description,
                status: "Available",
                images: itemDetails.images || "",
                condition: itemDetails.condition,
                size: itemDetails.size,
                brand: itemDetails.brand,
                posted_date: new Date().toISOString(),
                price: parseFloat(itemDetails.price),
                location: itemDetails.location,
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
      
              if (!response.ok) {
                throw new Error("Something went wrong");
              }
      
              const json = await response.json();
              await DataStorageSingleton.getInstance().fetchClothesData(await getToken(), userId, isLoaded);
              // router.replace({pathname: '/(auth)/marketplace'})
              router.back();
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
                <View style={[styles.imagePicker, image? styles.imagePickerAfterSelection : styles.imagePickerBeforeSelection]}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                ) : (<View></View>)}
                </View>

                <Text style={styles.label}>Brand</Text>
                <TextInput
                    // label="Brand"
                    value={itemDetails.brand}
                    onChangeText={text => handleInputChange('brand', text)}
                    style={styles.input}
                />
                <Text style={styles.label}>Item Condition</Text>
                <View style={styles.toggleButtonGroup}>
                  {conditions.map((condition) => (
                    <ToggleButton
                      key={condition}
                      label={condition}
                      isActive={itemDetails.condition == condition}
                      onPress={() => handleInputChange('condition', condition)}
                    />
                  ))}
                </View>
                <Text style={styles.label}>Size</Text>
                <View style={styles.toggleButtonGroup}>
                  {sizes.map((size) => (
                    <ToggleButton
                      key={size}
                      label={size}
                      isActive={itemDetails.size == size}
                      onPress={() => handleInputChange('size', size)}
                    />
                  ))}
                </View>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    // label="Description"
                    value={itemDetails.description}
                    onChangeText={text => handleInputChange('description', text)}
                    multiline
                    numberOfLines={4}
                    style={styles.input}
                />
                <Text style={styles.label}>Price</Text>
                <TextInput
                    // label="Price (EUR)"
                    value={itemDetails.price}
                    onChangeText={text => handleInputChange('price', text)}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <Text style={styles.label}>Location</Text>
                <TextInput
                    // label="Location"
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
        height: 40,
        borderRadius: 7,
        backgroundColor: '#fff',
        padding: 10,
        color: 'black',
        borderWidth: 0.5,
        borderColor: 'black'
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
    toggleButtonGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    label: {
      fontSize: 18,
      marginTop: 20,
      marginBottom: 10,
    },
});

export default UploadMarketplaceItem;
