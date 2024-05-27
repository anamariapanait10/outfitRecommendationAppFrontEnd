import React, { useState } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Colors from "../../../constants/Colors";
import ChooseImageModal from '../../../components/choose_image_modal';
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "@clerk/clerk-expo";
import { DataStorageSingleton } from "../../../constants/data_storage_singleton";
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import SpinnerOverlay from '../../../components/spinner_overlay';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import ToggleButton from '../../../components/ToggleButton';
import SliderMarks from '../../../components/SliderMarks';


const ClothingItemForm = () => {
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("");
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { isLoaded, userId, getToken } = useAuth();
  const [selectedTemperature, setTemperature] = useState(10);
  const [selectedWeather, setWeather] = useState(50);
  const [selectedPreference, setPreference] = useState(0.5);

  const [imageError, setImageError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [subcategoryError, setSubcategoryError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [materialError, setMaterialError] = useState(false);
  const [patternError, setPatternError] = useState(false);
  const [seasonError, setSeasonError] = useState(false);
  const [occasionError, setOccasionError] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setDescription("");
      setSelectedCategory("");
      setSelectedColor("");
      setSelectedMaterial("");
      setSelectedPattern("");
      setSelectedSeasons([]);
      setSelectedOccasions([]);
      setImage("");
    }, [])
  );

  const handleToggle = (selection, selectionsList, setSelectionsList) => {
    if (selectionsList.includes(selection)) {
      setSelectionsList(selectionsList.filter((s) => s !== selection));
    } else {
      setSelectionsList([...selectionsList, selection]);
    }
  };

  const uploadImage = async (mode: string) => {
    try {
      let result = {};
      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          // aspect: [1, 1],
          quality: 1,
          base64: true,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          // aspect: [1, 1],
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

  const sendImageForProcessing = async (image: any) => {
    try {
      setImage(image);
      setModalVisible(false);
      setLoading(true);
      const token = await getToken();
      const requestBody = JSON.stringify({
        image: image,
      });
      const response = await fetch(
        process.env.EXPO_PUBLIC_BASE_API_URL + "/outfit-items/classify/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: requestBody
        }
      );
      let classification_results = await response.json();
      setLoading(false);
      console.log("POST request response:", classification_results);
      setSelectedCategory(classification_results['category']);
      setSelectedSubCategory(classification_results['subcategory']);
      setSelectedOccasions([classification_results['occasions']]);
      setSelectedColor(classification_results['color']);
      setSelectedSeasons(classification_results['season'].split(","));
      setSelectedMaterial(classification_results['material']);
      setSelectedPattern(classification_results['pattern']);
      setTemperature(classification_results['temperature']);
      setWeather(classification_results['weather']);
      setPreference(classification_results['preference']);
    } catch (error) {
      throw error;
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
          category: selectedCategory,
          subCategory: selectedSubCategory,
          description: description || "",
          color: selectedColor,
          image: image,
          pattern: selectedPattern,
          material: selectedMaterial,
          seasons: selectedSeasons.join(","),
          occasions: selectedOccasions.join(","),
          temperature: selectedTemperature,
          weather: selectedWeather,
          preference: selectedPreference,
        });

        console.log("POST request body:", requestBody);

        const response = await fetch(
          process.env.EXPO_PUBLIC_BASE_API_URL + "/outfit-items/",
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
        // console.log("POST request response:", json);
        DataStorageSingleton.getInstance().fetchClothesData(await getToken(), userId, isLoaded);
        // router.replace({pathname: '/(auth)/wardrobe'})
        router.back();
      } catch (error) {
        console.error("Error making POST request:", error);
      }
    };

    let localImageError = image === '';
    let localCategoryError = selectedCategory === '';
    let localSubcategoryError = selectedSubCategory === '';
    let localColorError = selectedColor === '';
    let localMaterialError = selectedMaterial === '';
    let localPatternError = selectedPattern === '';
    let localSeasonError = selectedSeasons.length === 0;
    let localOccasionError = selectedOccasions.length === 0;

    setImageError(localImageError);
    setCategoryError(localCategoryError);
    setSubcategoryError(localSubcategoryError);
    setColorError(localColorError);
    setMaterialError(localMaterialError);
    setPatternError(localPatternError);
    setSeasonError(localSeasonError);
    setOccasionError(localOccasionError);

    if (localImageError || localCategoryError || localSubcategoryError || localColorError || localMaterialError || localPatternError || localSeasonError || localOccasionError) {
      return;
    }

    makePostRequest();
  };

  const categories = ['Topwear', 'Bottomwear', 'Footwear', 'Bodywear', 'Headwear', 'Accessories'];
  const subCategory = { 
    'Topwear': ['Shirt', 'T-shirt', 'Polo Shirt', 'Sweater', 'Jacket', 'Hoodie', 'Blazer'], 
    'Bottomwear': ['Jeans', 'Track Pants', 'Shorts', 'Skirt', 'Trousers', 'Leggings'], 
    'Footwear': ['Sneakers', 'Slippers', 'Sandals', 'Flats', 'Sports Shoes', 'Heels', "Hiking Shoes", 'Boots', 'Sandal Heels'],
    'Bodywear': ['Dress', 'Bodysuit', 'Jumpsuit'],
    'Headwear': ['Cap', 'Hat', 'Beanie'],
    'Accessories': ['Tie', 'Watch', 'Belt', 'Jewelry', 'Handbag', 'Backpack']
  };
  const colors = [
    'White', 'Beige', 'Black', 
    'Light gray', 'Gray', 'Dark gray', 
    'Yellow',  'Dark yellow',  
    'Light green', 'Green', 'Dark green', 
    'Turquoise',  'Orange',
    'Light blue', 'Blue', 'Dark blue',  
    'Light pink', 'Pink', 'Red',
    'Dark red', 'Brown', 'Purple', 'Multicolor'
  ];
  const materials = ['Cotton', 'Synthetic Fibers', 'Silk', 'Leather', 'Wool', 'Linen'];
  const patterns = ['Striped', 'Checkered', 'Floral', 'Dotted', 'Plain', 'Animal Print', 'Camouflage', 'Graphic'];
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
  const occasions = ['Casual', 'Ethnic', 'Formal', 'Sports', 'Smart Casual', 'Party'];

  const majorTempMarks = [5, 21];

  return (
    <ScrollView>
      <SpinnerOverlay isVisible={loading} />
      <View style={styles.container}>
        {/* Image picker */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.imagePicker, image? styles.imagePickerAfterSelection : styles.imagePickerBeforeSelection]}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Text>Select an Image</Text>
          )}
        </TouchableOpacity>
        {imageError && <Text style={styles.errorLabel}>Image is required</Text>}
        
        {/* Description */}

        <Text style={styles.title}>What item is this?</Text>
        
        {/* Category selection */}
        <Text style={styles.label}>Category</Text>
        <View style={[styles.toggleButtonGroup, {gap: 0}]}>
          {categories.map((category) => (
            <ToggleButton
              key={category}
              label={category}
              isActive={selectedCategory == category}
              onPress={() => {setSelectedCategory(category)}}
              fixedSize='32%'
            />
          ))}
        </View>
        {categoryError && <Text style={styles.errorLabel}>Category is required</Text>}

        {selectedCategory && (
        <View style={styles.subcategoryContainer}>
          <Text style={styles.subcategoryHeader}>{selectedCategory}</Text>
          <View style={styles.toggleButtonGroup}>
            {subCategory[selectedCategory].map((subcategory) => (
              <ToggleButton
              key={subcategory}
              label={subcategory}
              isActive={selectedSubCategory == subcategory}
              onPress={() => {setSelectedSubCategory(subcategory)}}
              fixedSize='30%'
              />
            ))}
          </View>
          {subcategoryError && <Text style={styles.errorLabel}>Subcategory is required</Text>}
        </View>
      )}
        
        {/* Color selection */}
        <Text style={styles.label}>Color</Text>
        <View style={[styles.toggleButtonGroup, {justifyContent: 'center', gap: 2}]}>
          {colors.map((color) => (
            <ToggleButton
              key={color}
              label={color.replace('Light ', 'L-').replace('Dark ', 'D-')}
              isActive={selectedColor?.toLowerCase() == color.toLowerCase()}
              onPress={() => setSelectedColor(color)}
              color={color.toLowerCase().replace(' ', '-')}
              fixedSize={'32%'}
            />
          ))}
        </View>
        {colorError && <Text style={styles.errorLabel}>Color is required</Text>}
        
        {/* Material selection */}
        <Text style={styles.label}>Material</Text>
        <View style={styles.toggleButtonGroup}>
          {materials.map((material) => (
            <ToggleButton
              key={material}
              label={material}
              isActive={selectedMaterial == material}
              onPress={() => setSelectedMaterial(material)}
              fixedSize='30%'
            />
          ))}
        </View>
        {materialError && <Text style={styles.errorLabel}>Material is required</Text>}
        
        {/* Pattern selection */}
        <Text style={styles.label}>Pattern</Text>
        <View style={[styles.toggleButtonGroup, {justifyContent: 'center'}]}>
          {patterns.map((pattern) => (
            <ToggleButton
              key={pattern}
              label={pattern}
              isActive={selectedPattern == pattern}
              onPress={() => setSelectedPattern(pattern)}
              fixedSize='30%'
            />
          ))}
        </View>
        {patternError && <Text style={styles.errorLabel}>Pattern is required</Text>}

        <Text style={styles.title}>When will you wear it?</Text>
        
        <Text style={styles.label}>Season</Text>
        <View style={styles.toggleButtonGroup}>
          {seasons.map((season) => (
            <ToggleButton
              key={season}
              label={season}
              isActive={selectedSeasons.includes(season)}
              onPress={() => handleToggle(season, selectedSeasons, setSelectedSeasons)}
              fixedSize='23%'
            />
          ))}
        </View>
        {seasonError && <Text style={styles.errorLabel}>Season is required</Text>}
        
        <Text style={styles.label}>Occasions</Text>
        <View style={styles.toggleButtonGroup}>
          {occasions.map((occasion) => (
            <ToggleButton
              key={occasion}
              label={occasion}
              isActive={selectedOccasions.includes(occasion)}
              onPress={() => handleToggle(occasion, selectedOccasions, setSelectedOccasions)}
              fixedSize='32%'
            />
          ))}
        </View>
        {occasionError && <Text style={styles.errorLabel}>Occasion is required</Text>}

        <ChooseImageModal
          modalVisible={modalVisible}
          onBackPress={() => setModalVisible(false)}
          onCameraPress={() => uploadImage("camera")}
          onGalleryPress={() => uploadImage("gallery")}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.slider_label_temp}>Temperature: {Math.round(selectedTemperature)}°</Text>
        
        <View style={styles.iconRow}>
          <Ionicons name="snow-outline" size={30} color="#0000FF" />
          <Ionicons name="sunny-outline" size={30} color="#FFD700" style={styles.iconRight} />
        </View>
        <LinearGradient
            colors={['#2222FF', '#55AA55', '#FF2222']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradient}>
            <SliderMarks minimumValue={-10} maximumValue={40} step={5} style={styles.marksBelow} />
            {majorTempMarks.map((mark) => {
              const position = ((mark + 10) / 50) * Dimensions.get('window').width;
              return (
                <View key={mark} style={[styles.majorMark, { left: position }]}>
                  <Text>cur</Text>
                </View>
              );
            })}
            <Slider
              style={styles.slider}
              minimumValue={-10}
              value={selectedTemperature}
              maximumValue={40}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor={Colors.dark_purple}
              onValueChange={setTemperature}
            />
        </LinearGradient>
        
        <Text style={styles.slider_label}>Weather</Text>
        <View style={styles.iconRow}>
          <Ionicons name="snow-outline" size={30} color="#708090" />
          <Ionicons name="rainy-outline" size={30} color="#708090" style={styles.iconCenter} />
          <Ionicons name="cloudy-outline" size={30} color="#708090" style={styles.iconCenter} />
          <Ionicons name="sunny-outline" size={30} color="#FFD700" style={styles.iconRight} />
        </View>  
        <LinearGradient
            colors={['#FFFFFF', '#55AA55', '#FFD700']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradient}>
            <SliderMarks minimumValue={0} maximumValue={30} step={5} style={styles.marksBelow} />
            <Slider
              style={styles.slider}
              minimumValue={0}
              value={selectedWeather}
              maximumValue={30}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor={Colors.purple}
              onValueChange={setWeather}
            /> 
        </LinearGradient>
        
        <Text style={styles.slider_label}>Preference</Text>
        <View style={styles.iconRow}>
          <Ionicons name="sad-outline" size={30} color={Colors.purple} />
          <Ionicons name="happy-outline" size={30} color={Colors.light_purple} style={styles.iconRight} />
        </View>  
        <LinearGradient
            colors={[Colors.purple, Colors.light_purple]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradient}>
            <SliderMarks minimumValue={0} maximumValue={1} step={0.33} style={styles.marksBelow} />
            <Slider
              style={styles.slider}
              minimumValue={0}
              value={selectedPreference}
              maximumValue={1}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor={Colors.purple}
              onValueChange={setPreference}
            /> 
        </LinearGradient>
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
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
  },
  label: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  toggleButtonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toggleButton: {
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: Colors.grey,
    margin: 5,
  },
  toggleButtonColor: {
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: Colors.grey,
    marginTop: 5,
    marginBottom: 5
  },
  activeButton: {
    backgroundColor: Colors.purple,
  },
  inactiveButton: {
    backgroundColor: 'white',
  },
  toggleButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  activeText: {
    color: 'white',
  },
  inactiveText: {
    color: 'black',
  },
  saveButton: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 30,
    // marginBottom: 50,
    alignSelf: 'flex-end',
    width: '45%',
  },
  saveButtonText: {
    fontSize: 17,
    color: 'white',
    textAlign: 'center',
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300, 
    marginBottom: 20,
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
  colorSquare: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 0.6,
    borderColor: '#222222',
    marginRight: 10,
  },
  subcategoryContainer: {
    marginTop: 20,
  },
  subcategoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subcategoryText: {
    fontSize: 16,
    color: 'gray',
  },
  slider: {
    height: 80,
    // margin: 10,
    // width: '100%',
  },
  slider_label_temp: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  slider_label: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  iconCenter: {
    marginLeft: 'auto',
  },
  iconRight: {
    marginLeft: 'auto',
  },
  gradient: {
    borderRadius:7,
    height: 30,
    justifyContent: 'center',
    borderColor: '#FFF',
    borderWidth: 5,
  },
  colorButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  majorMark: {
    position: 'absolute',
    // bottom: -20,
    width: 2,
    height: 20,
    backgroundColor: '#000',
  },
  marksBelow: {
  
  },
  errorLabel: {
    color: 'red',
    fontSize: 12,
  }
});

export default ClothingItemForm;
