import React, { useState } from 'react';
import { Image, ScrollView, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { DataStorageSingleton } from '../../../../constants/data_storage_singleton';
import { router, useLocalSearchParams } from 'expo-router';
import { ClothingItem } from '../../../../components/cloth_card';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useAuth } from "@clerk/clerk-expo";
import Colors from "../../../../constants/Colors";
import ToggleButton from "../../../../components/ToggleButton"
import SpinnerOverlay from '../../../../components/spinner_overlay';
import DropDownPicker from 'react-native-dropdown-picker';

const UploadMarketplaceItem = () => {
    const [itemDetails, setItemDetails] = useState({
        description: '',
        condition: '',
        size: '',
        brand: '',
        price: '',
        location: '',
        images: null,
        phone_number: '',
    });
    
    const clothSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const conditions = ['Poor', 'Good', 'Like new', 'New'];

    const { id } = useLocalSearchParams();
    const placeholderImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/B8AAwAB/QL8T0LgAAAABJRU5ErkJggg==";
    const [ cloth, setCloth ] = useState(new ClothingItem(0, 0, "", "", "", "", "", "", "", "", placeholderImage));
    const isFocused = useIsFocused();
    const { isLoaded, userId, getToken } = useAuth();
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    
    const [isShoeSizeDropdownOpen, setIsShoeSizeOpen] = useState(false);
    const [shoeSizeItems, setShoeSizeItems] = useState([ 
      { label: 'None', value: null },
      { label: '35', value: 35 },
      { label: '36', value: 36 },
      { label: '37', value: 37 },
      { label: '38', value: 38 },
      { label: '39', value: 39 },
      { label: '40', value: 40 },
      { label: '41', value: 41 },
      { label: '42', value: 42 },
      { label: '43', value: 43 },
      { label: '44', value: 44 },
      { label: '45', value: 45 },
      { label: '46', value: 46 },
      { label: '47', value: 47 },
      { label: '48', value: 48 },
      { label: '49', value: 49 },
      { label: '50', value: 50 },
    ]);

    const [brandError, setBrandError] = useState(false);
    const [conditionError, setConditionError] = useState(false);
    const [sizeError, setSizeError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [locationError, setLocationError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);


    const handleInputChange = (name, value) => {
      if(name === 'phone_number') {
        const phoneRegex = /^[0-9]{10}$/;
        setPhoneError(!phoneRegex.test(value) && value.length > 0);      
      }
      setItemDetails({ ...itemDetails, [name]: value });
    };

    const onNavigateToPage = () => {
        if(typeof id == 'string') {
          let ci = DataStorageSingleton.getInstance().clothingItems.find(i => i.id == parseInt(id));  
          if(ci) {
            setCloth(ci);
            setImage(ci.image);
            DataStorageSingleton.getInstance().clothId = ci.id;
            generateDescription(ci.id);
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

    const generateDescription = async (id) => {
      try {
        setLoading(true);
        if (!userId || !isLoaded) {
          console.log("No authenticated user found.");
          return;
        }
        const token = await getToken();
        const requestBody = JSON.stringify({
          id: id,
        });
        const response = await fetch(
          process.env.EXPO_PUBLIC_BASE_API_URL + "/outfit-items/get_description/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: requestBody
          }
        );
        let description = await response.text();
        setLoading(false);
        setItemDetails({ ...itemDetails, description: description.replaceAll('\"', '')});
      } catch (error) {
          console.error('Error generating description:', error);
      }
  };

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
                phone_number: itemDetails.phone_number,
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
        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        const brandRegex = /^[a-zA-Z0-9\s&]+$/;
        const locationRegex = /^[a-zA-Z0-9\s,.'-]{1,100}$/;
        const numericRegex = /^[0-9]*\.?[0-9]+$/;
        
        let localBrandError = !itemDetails.brand || !brandRegex.test(itemDetails.brand)
        let localConditionError = !itemDetails.condition|| !alphanumericRegex.test(itemDetails.condition)
        let localSizeError = !itemDetails.size || !alphanumericRegex.test(itemDetails.size)
        let localDescriptionError = !itemDetails.description || !alphanumericRegex.test(itemDetails.description)
        let localPriceError = !itemDetails.price || !numericRegex.test(itemDetails.price)
        let localLocationError = !itemDetails.location || !locationRegex.test(itemDetails.location)
        let localPhoneError = !itemDetails.phone_number || itemDetails.phone_number.length != 10

        setBrandError(localBrandError);
        setConditionError(localConditionError);
        setSizeError(localSizeError);
        setDescriptionError(localDescriptionError);
        setPriceError(localPriceError);
        setLocationError(localLocationError);
        setPhoneError(localPhoneError);
      
        if (localBrandError || localConditionError || localSizeError || localDescriptionError || localPriceError || localLocationError || localPhoneError) {
            return;
        }

        makePostRequest();
    };

    return (
        <ScrollView style={styles.container}>
            <SpinnerOverlay isVisible={loading} />
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
                {brandError && <Text style={styles.errorLabel}>Brand is required</Text>}
                <Text style={styles.label}>Item Condition</Text>
                <View style={styles.toggleButtonGroup}>
                  {conditions.map((condition) => (
                    <ToggleButton
                      key={condition}
                      label={condition}
                      isActive={itemDetails.condition == condition}
                      onPress={() => handleInputChange('condition', condition)}
                      fixedSize='22%'
                    />
                  ))}
                </View>
                {conditionError && <Text style={styles.errorLabel}>Condition is required</Text>}
                <Text style={styles.label}>Size</Text>
                { cloth.category !== "Footwear" ? ( 
                  <View style={styles.toggleButtonGroup}>
                    {clothSizes.map((size) => (
                      <ToggleButton
                        key={size}
                        label={size}
                        isActive={itemDetails.size == size}
                        onPress={() => handleInputChange('size', size)}
                        fixedSize='15%'
                      />
                    ))}
                  </View>) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <DropDownPicker
                        open={isShoeSizeDropdownOpen}
                        value={itemDetails.size}
                        items={shoeSizeItems}
                        setOpen={setIsShoeSizeOpen}
                        setValue={(value) => { handleInputChange('size', value(null))}}
                        setItems={setShoeSizeItems}
                        placeholder="Select Size"
                        zIndex={3000}
                        zIndexInverse={1000}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        listMode="SCROLLVIEW"
                      />
                    </View>
                  )
                }
                {sizeError && <Text style={styles.errorLabel}>Size is required</Text>}
                
                <Text style={styles.label}>Description</Text>
                <TextInput
                    // label="Description"
                    value={itemDetails.description}
                    onChangeText={text => handleInputChange('description', text)}
                    multiline
                    numberOfLines={4}
                    style={[styles.input, {height: 80}]}
                />
                {descriptionError && <Text style={styles.errorLabel}>Description is required</Text>}
                <Text style={styles.label}>Price (USD)</Text>
                <TextInput
                    // label="Price (EUR)"
                    value={itemDetails.price}
                    onChangeText={text => handleInputChange('price', text)}
                    keyboardType="numeric"
                    style={styles.input}
                />
                {priceError && <Text style={styles.errorLabel}>Price is required and should be a valid number</Text>}
                <Text style={styles.label}>Location</Text>
                <TextInput
                    // label="Location"
                    value={itemDetails.location}
                    onChangeText={text => handleInputChange('location', text)}
                    style={styles.input}
                />
                {locationError && <Text style={styles.errorLabel}>Location is required</Text>}
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    value={itemDetails.phone_number}
                    keyboardType='phone-pad'
                    onChangeText={text => handleInputChange('phone_number', text)}
                    style={styles.input}
                />
                {phoneError && <Text style={styles.errorLabel}>Phone number should have 10 numbers</Text>}
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <TouchableOpacity style={[styles.saveButton, {backgroundColor: Colors.grey,}]} onPress={() => router.back()}>
                      <Text style={styles.saveButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.saveButton, {backgroundColor: Colors.purple,}]} onPress={handleSubmit}>
                      <Text style={styles.saveButtonText}>Save Item</Text>
                  </TouchableOpacity>
                </View>
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
      paddingVertical: 9,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginTop: 20,
      marginBottom: 30,
      alignSelf: 'flex-end',
      width: '45%',
    },
    saveButtonText: {
        fontSize: 17,
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
    dropdown: {
      width: '100%',
      borderColor: '#bdbdbd',
    },
    dropdownContainer: {
      borderColor: '#cccccc',
      width: '100%',
      zIndex: 5000
    },
    errorLabel: {
      color: 'red',
      fontSize: 12,
    }
});

export default UploadMarketplaceItem;
