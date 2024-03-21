import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import ChooseImageModal from "./choose_image_modal";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@clerk/clerk-expo";
import { DataStorageSingleton } from "./data_storage_singleton";
import { router } from 'expo-router';

const AddItemPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { isLoaded, userId, sessionId, getToken } = useAuth();

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
        saveImage('data:image/jpeg;base64,' + result.assets[0].base64);
      }
    } catch (error: any) {
      alert("Error uploading image: " + error.message);
      setModalVisible(false);
    }
  };

  const saveImage = async (image: any) => {
    try {
      setImage(image);
      setModalVisible(false);
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      "Item Added",
      `Name: ${name}, Type: ${type}, Size: ${size}, Color: ${color}`
    );

    const makePostRequest = async () => {
      if (!userId || !isLoaded) {
        console.log("No authenticated user found.");
        return;
      }
      try {
        const token = await getToken();
        // const wardrobe = await fetch(
        //   process.env.EXPO_PUBLIC_BASE_API_URL + "/wardrobes/", 
        //   { 
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        // if (!wardrobe.ok) {
        //   throw new Error("Something went wrong");
        // }

        const requestBody = JSON.stringify({
          name: name,
          description: description || "",
          size: size || "",
          color: color,
          image: image,
          category: category || "",
          wardrobe_id: 1
        });

        console.log("POST request body:" + requestBody);

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
    };

    makePostRequest();

    // Reset form fields
    // setName("");
    // setType("");
    // setSize("");
    // setColor("");
    // setImage("");
    // setDescription("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
    <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
      <View style={styles.chooseImageContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} >
          {image ? (
              <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={{color:"#6c47ff"}}>Choose Image</Text>
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Name *"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Type (e.g., Shirt, Pants) *"
        value={type}
        onChangeText={setType}
        style={styles.input}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={size}
          onValueChange={(itemValue, itemIndex) => setSize(itemValue)}
          style={{ width: '100%', height: 40}}
        >
          <Picker.Item label="S" value="S" />
          <Picker.Item label="M" value="M" />
          <Picker.Item label="L" value="L" />
        </Picker>
      </View>
      <TextInput
        placeholder="Color *"
        value={color}
        onChangeText={setColor}
        style={styles.input}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
          style={{ width: '100%', height: 40}}
        >
          <Picker.Item label="Topwear" value="Topwear" />
          <Picker.Item label="Bottomwear" value="Bottomwear" />
          <Picker.Item label="Shoes" value="Shoes" />
        </Picker>
      </View>
      <ChooseImageModal
        modalVisible={modalVisible}
        onBackPress={() => setModalVisible(false)}
        onCameraPress={() => uploadImage("camera")}
        onGalleryPress={() => uploadImage("gallery")}
      />
      
      
      <View style={styles.buttonContainer}>
        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Add Item</Text>
        </Pressable>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "#6c47ff",
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  chooseImageContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  pickerContainer: {
    height: 40,
    borderColor: "#6c47ff",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 15,
    right: 20, 
  },
  button: {
    backgroundColor: '#7b68ee',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 7, 
  },
  buttonText: {
    color: '#FFFFFF',
  },
});

export default AddItemPage;
