import React, { useState } from 'react';
import { Alert, Image, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Colors from "../../constants/Colors";
import ChooseImageModal from './choose_image_modal';
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "@clerk/clerk-expo";
import { DataStorageSingleton } from "./data_storage_singleton";
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import SpinnerOverlay from './spinner_overlay';


const ToggleButton = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.toggleButton, isActive ? styles.activeButton : styles.inactiveButton]}
    onPress={onPress}>
    <Text style={[styles.toggleButtonText, isActive ? styles.activeText : styles.inactiveText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

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
      // If the selection is already in the selectionsList, we remove it from it
      setSelectionsList(selectionsList.filter((s) => s !== selection));
    } else {
      // If the selection is not already the selectionsList, we add it
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
        // console.log(result.assets[0].base64);
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
      setSelectedSeasons([classification_results['season']]);

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
          occasions: selectedOccasions.join(",")
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
        router.replace({pathname: '/(auth)/wardrobe'})
      } catch (error) {
        console.error("Error making POST request:", error);
      }

      // Alert.alert(
      //   "Item Added",
      //   `Item with seasons: ${selectedSeasons.join(', ')}, occasions: ${selectedOccasions.join(', ')}, `
      //   + `categories: ${selectedCategories.join(', ')}, colors: ${selectedColors.join(', ')}, materials: ${selectedMaterials.join(', ')}, `
      //   + `patterns: ${selectedPatterns.join(', ')} added.`
      // );
    };

    makePostRequest();

    // Reset form fields
    setImage("");
    setDescription("");
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedColor("");
    setSelectedMaterial("");
    setSelectedPattern("");
    setSelectedOccasions([]);
    setSelectedSeasons([]);
  };

  const categories = ['Topwear', 'Bottomwear', 'Footwear', 'Bodywear', 'Headwear', 'Accessories'];
  const subCategory = { 
    'Topwear': ['Shirts', 'Tshirts', 'Tops', 'Sweatshirts', 'Waistcoat', 'Blazers', 'Shrug', 'Tunics', 'Jackets', 'Sweaters', 'Suspenders', 'Nehru Jackets', 'Rompers', 'Rain Jacket', 'Suits'], 
    'Bottomwear': ['Jeans', 'Track Pants', 'Shorts', 'Skirts', 'Trousers', 'Capris', 'Tracksuits', 'Swimwear', 'Leggings', 'Patiala', 'Stockings', 'Tights', 'Salwar', 'Jeggings'], 
    'Footwear':  ['Casual Shoes', 'Flip Flops', 'Sandals', 'Formal Shoes', 'Flats', 'Sports Shoes', 'Heels', 'Sports Sandals'],
    'Bodywear': ['Dresses', 'Jumpsuit'],
    'Headwear': ['Caps', 'Hat', 'Headband'],
    'Accessories': [
      'Watches', 'Belts', 'Handbags', 'Bracelet', 'Pendant', 'Ring', 'Clutches',
      'Backpacks', 'Earrings', 'Jewellery Set', 'Necklace and Chains', 'Duffel Bag', 'Ties',
      'Travel Accessory', 'Mobile Pouch', 'Messenger Bag', 'Accessory Gift Set', 'Tablet Sleeve', 
      'Waist Pouch', 'Hair Accessory', 'Rucksacks', 'Key chain', 'Tshirts', 'Water Bottle'
    ]
  };
  const colors = [
    "Navy Blue", "Blue", "Silver", "Black", "Grey", "Green", "Purple", "White", "Brown",
    "Bronze", "Teal", "Copper", "Pink", "Off White", "Beige", "Red", "Khaki", "Orange", 
    "Yellow", "Charcoal", "Steel", "Gold", "Tan", "Magenta", "Lavender", "Sea Green", 
    "Cream", "Peach", "Olive", "Burgundy", "Multi", "Maroon", "Grey Melange", "Rust", 
    "Turquoise Blue", "Metallic", "Mustard", "Coffee Brown", "Taupe", "Mauve", 
    "Mushroom Brown", "Nude", "Fluorescent Green", "Lime Green", "Rose"
  ];
  const materials = ['Cotton', 'Leather', 'Polyester', 'Nylon'];
  const patterns = ['Graphic', 'Plain', 'Striped', 'Polka Dot'];
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  const occasions = ['Casual', 'Ethnic', 'Formal', 'Sports', 'Smart Casual', 'Travel', 'Party'];

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
          {/* <Ionicons name="create-outline" size={24} style={styles.editButton} /> */}
        </TouchableOpacity>

        <Text style={styles.title}>What item is this?</Text>
        
        {/* Category selection */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.toggleButtonGroup}>
          {categories.map((category) => (
            <ToggleButton
              key={category}
              label={category}
              isActive={selectedCategory == category}
              onPress={() => {setSelectedCategory(category)}}
            />
          ))}
        </View>

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
              />
            ))}
          </View>
        </View>
      )}
        
        {/* Color selection */}
        <Text style={styles.label}>Color</Text>
        <View style={styles.toggleButtonGroup}>
          {colors.map((color) => (
            <ToggleButton
              key={color}
              label={color}
              isActive={selectedColor == color}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
        
        {/* Material selection */}
        <Text style={styles.label}>Material</Text>
        <View style={styles.toggleButtonGroup}>
          {materials.map((material) => (
            <ToggleButton
              key={material}
              label={material}
              isActive={selectedMaterial == material}
              onPress={() => setSelectedMaterial(material)}
            />
          ))}
        </View>
        
        {/* Pattern selection */}
        <Text style={styles.label}>Pattern</Text>
        <View style={styles.toggleButtonGroup}>
          {patterns.map((pattern) => (
            <ToggleButton
              key={pattern}
              label={pattern}
              isActive={selectedPattern == pattern}
              onPress={() => setSelectedPattern(pattern)}
            />
          ))}
        </View>

        <Text style={styles.title}>When will you wear it?</Text>
        
        <Text style={styles.label}>Season</Text>
        <View style={styles.toggleButtonGroup}>
          {seasons.map((season) => (
            <ToggleButton
              key={season}
              label={season}
              isActive={selectedSeasons.includes(season)}
              onPress={() => handleToggle(season, selectedSeasons, setSelectedSeasons)}
            />
          ))}
        </View>
        
        <Text style={styles.label}>Occasions</Text>
        <View style={styles.toggleButtonGroup}>
          {occasions.map((occasion) => (
            <ToggleButton
              key={occasion}
              label={occasion}
              isActive={selectedOccasions.includes(occasion)}
              onPress={() => handleToggle(occasion, selectedOccasions, setSelectedOccasions)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        <ChooseImageModal
          modalVisible={modalVisible}
          onBackPress={() => setModalVisible(false)}
          onCameraPress={() => uploadImage("camera")}
          onGalleryPress={() => uploadImage("gallery")}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  },
  saveButtonText: {
    fontSize: 20,
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
  // editButton: {
  //   position: 'absolute',
  //   top: 10,
  //   right: 10,
  //   backgroundColor: 'white',
  //   padding: 3,
  //   borderRadius: 5,
  //   elevation: 3,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  // },
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
});

export default ClothingItemForm;
