import React, { useState, useEffect, useRef } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Colors from "../../../../constants/Colors";
import ChooseImageModal from '../../../../components/choose_image_modal';
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "@clerk/clerk-expo";
import { DataStorageSingleton } from "../../../../constants/data_storage_singleton";
import { router, useLocalSearchParams } from 'expo-router';
import SpinnerOverlay from '../../../../components/spinner_overlay';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import ToggleButton from '../../../../components/ToggleButton';
import SliderMarks from '../../../../components/SliderMarks';

const EditClothingItemForm = () => {
  const { id } = useLocalSearchParams();
  const placeholderImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/B8AAwAB/QL8T0LgAAAABJRU5ErkJggg==";
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("");
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [image, setImage] = useState(placeholderImage);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { isLoaded, userId, getToken } = useAuth();

  const [selectedTemperature, setTemperature] = useState(10);
  const [selectedWeather, setWeather] = useState(15);
  const [selectedPreference, setPreference] = useState(0.5);

  const [imageError, setImageError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [subcategoryError, setSubcategoryError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [materialError, setMaterialError] = useState(false);
  const [patternError, setPatternError] = useState(false);
  const [seasonError, setSeasonError] = useState(false);
  const [occasionError, setOccasionError] = useState(false);

  useEffect(() => {
    if (id) {
      const clothingItem = DataStorageSingleton.getInstance().clothingItems.find(i => i.id === parseInt(id));
      if (clothingItem) {
        setDescription(clothingItem.description);
        setSelectedCategory(clothingItem.category);
        setSelectedSubCategory(clothingItem.subCategory);
        if(clothingItem.color.includes("[")) {
          clothingItem.color = clothingItem.color.replaceAll("[", "").replaceAll("]", "").replaceAll("\'", "").replaceAll(" ", "");
        }
        setSelectedColor(clothingItem.color.split(","));
        setSelectedMaterial(clothingItem.material);
        setSelectedPattern(clothingItem.pattern);
        setSelectedSeasons(clothingItem.seasons.split(","));
        setSelectedOccasions(clothingItem.occasions.split(","));
        setImage(clothingItem.image);
        // console.log("temp ", clothingItem.itemprobability.temperatureSliderValue);
        // console.log("weather ", clothingItem.itemprobability.weatherSliderValue);
        // console.log("pref ", clothingItem.itemprobability.preference);
        setTemperature(parseFloat(clothingItem.itemprobability.temperatureSliderValue));
        setWeather(parseFloat(clothingItem.itemprobability.weatherSliderValue));
        setPreference(parseFloat(clothingItem.itemprobability.preference));
        
      }
    }
  }, [id]);

  const handleToggle = (selection, selectionsList, setSelectionsList) => {
    if (selectionsList.includes(selection)) {
      setSelectionsList(selectionsList.filter((s) => s !== selection));
    } else {
      setSelectionsList([...selectionsList, selection]);
    }
  };

  const uploadImage = async (mode) => {
    try {
      let result = {};
      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
          base64: true,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          quality: 1,
          base64: true,
        });
      }
      if (!result.canceled) {
        sendImageForProcessing('data:image/jpeg;base64,' + result.assets[0].base64);
      }
    } catch (error) {
      alert("Error uploading image: " + error.message);
      setModalVisible(false);
    }
  };

  const sendImageForProcessing = async (image) => {
    try {
      setImage(image);
      setModalVisible(false);
      setLoading(true);
      const token = await getToken();
      const requestBody = JSON.stringify({ image: image });
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
      setSelectedCategory(classification_results['category']);
      setSelectedSubCategory(classification_results['subcategory']);
      setSelectedOccasions([classification_results['occasions']]);
      setSelectedColor(classification_results['color'].split(","));
      setSelectedSeasons(classification_results['season'].split(","));
      setSelectedMaterial(classification_results['material']);
      setSelectedPattern(classification_results['pattern']);
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = () => {
    const makePutRequest = async () => {
      if (!userId || !isLoaded) {
        console.log("No authenticated user found.");
        return;
      }
      try {
        setLoading(true);
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

        console.log("PUT request body:", requestBody);

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BASE_API_URL}/outfit-items/${id}/`,
          {
            method: "PUT",
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
        router.back();
      } catch (error) {
        console.error("Error making PUT request:", error);
      } finally {
        setLoading(false);
      }
    };

    let localImageError = image === '';
    let localCategoryError = selectedCategory === '';
    let localSubcategoryError = selectedSubCategory === '';
    let localColorError = selectedColor.length === 0;
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

    makePutRequest();

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

  return (
    <ScrollView>
      <SpinnerOverlay isVisible={loading} />
      <View style={styles.container}>
        {/* Image picker */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.imagePicker, image ? styles.imagePickerAfterSelection : styles.imagePickerBeforeSelection]}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Text>Select an Image</Text>
          )}
        </TouchableOpacity>
        {imageError && <Text style={styles.errorLabel}>Image is required</Text>}

        <Text style={styles.title}>What item is this?</Text>
        
        {/* Category selection */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.toggleButtonGroup}>
          {categories.map((category) => (
            <ToggleButton
              key={category}
              label={category}
              isActive={selectedCategory == category}
              onPress={() => { setSelectedCategory(category) }}
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
                  onPress={() => { setSelectedSubCategory(subcategory) }}
                  fixedSize='30%'
                />
              ))}
            </View>
          </View>
        )}
        {subcategoryError && <Text style={styles.errorLabel}>Subcategory is required</Text>}
        
        {/* Color selection */}
        <Text style={styles.label}>Color</Text>
        <View style={[styles.toggleButtonGroup, {justifyContent: 'center', gap: 2}]}>
          {colors.map((color) => (
            <ToggleButton
              key={color}
              label={color.replace('Light ', 'L-').replace('Dark ', 'D-')}
              isActive={Array.isArray(selectedColor) && selectedColor.map(c => c.toLowerCase()).includes(color.toLowerCase())}
              onPress={() => {selectedColor.includes(color.toLowerCase()) ? setSelectedColor(selectedColor.filter(c => c.toLowerCase() !== color.toLowerCase())) : setSelectedColor([color.toLowerCase(), ...selectedColor])}}
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
          <Ionicons name="thermometer-outline" size={30} color="#0000FF" />
          <Ionicons name="thermometer-outline" size={30} color={Colors.red} style={styles.iconRight} />
        </View>
        <LinearGradient
            colors={['#2222FF', '#FFD700', '#FF2222']}
            start={{x: 0.05, y: 0}}
            end={{x: 0.95, y: 0}}
            style={styles.gradient}>
            <SliderMarks minimumValue={-10} maximumValue={40} step={16.6} style={styles.marksBelow} />
            {/* {majorTempMarks.map((mark) => {
              const position = ((mark + 10) / 50) * Dimensions.get('window').width;
              return (
                <View key={mark} style={[styles.majorMark, { left: position }]}>
                  <Text>cur</Text>
                </View>
              );
            })} */}
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
            colors={['#FFFFFF', '#2222FF', '#55AA55', '#FFD700']}
            start={{x: 0.05, y: 0}}
            end={{x: 0.95, y: 0}}
            style={styles.gradient}>
            <SliderMarks minimumValue={0} maximumValue={30} step={7.5} style={styles.marksBelow} />
            <Slider
              style={styles.slider}
              minimumValue={0}
              value={selectedWeather}
              maximumValue={30}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor={Colors.dark_purple}
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
              thumbTintColor={Colors.dark_purple}
              onValueChange={setPreference}
            /> 
        </LinearGradient>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity style={[styles.saveButton, {backgroundColor: Colors.cancel_btn,}]} onPress={() => router.back()}>
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
    borderColor: Colors.black,
    margin: 5,
  },
  toggleButtonColor: {
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: Colors.black,
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
    backgroundColor: Colors.purple,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 30,
    alignSelf: 'flex-end',
    width: '45%'
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
    borderRadius: 20,
    height: 30,
    justifyContent: 'center',
    borderColor: '#FFF',
    borderWidth: 5,
  },
  colorButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marksBelow: {
  },
  errorLabel: {
    color: 'red',
    fontSize: 12,
  }
});

export default EditClothingItemForm;
