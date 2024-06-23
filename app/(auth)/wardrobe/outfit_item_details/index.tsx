import React, { useState } from 'react';
import { View, ScrollView, Pressable, Image, StyleSheet, TouchableOpacity } from 'react-native';
import styles from '../../../styles';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ClothingItem } from '../../../../components/cloth_card';
import { DataStorageSingleton } from '../../../../constants/data_storage_singleton';
import { useFocusEffect } from '@react-navigation/native';
import ClothInfoTable from '../../../../components/ClothInfoTable';
import Colors from '../../../../constants/Colors';
import { useAuth } from '@clerk/clerk-expo';
import CustomAlert from '../../../../components/CustomAlert';

const OutfitItemDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const placeholderImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/B8AAwAB/QL8T0LgAAAABJRU5ErkJggg==";
  const [ cloth, setCloth ] = useState(new ClothingItem(0, 0, "", "", "", "", "", "", "", "", placeholderImage));
  const { isLoaded, userId, getToken } = useAuth();
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);

  const onNavigateToPage = () => {
    if(typeof id == 'string') {
      let ci = DataStorageSingleton.getInstance().clothingItems.find(i => i.id == parseInt(id));  
      if(ci) {
        setCloth(ci);
        DataStorageSingleton.getInstance().clothId = ci.id;
      }
    }
  };

  const handleDeleteCloth = async () => {
    if (!userId || !isLoaded) {
      console.log('No authenticated user found.');
      return;
    }
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/outfit-items/${DataStorageSingleton.getInstance().clothId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete the item');
      }
  
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      onNavigateToPage();

      return () => {
        setCloth(new ClothingItem(0, 0, "", "", "", "", "", "", "", "", placeholderImage));
      };
     
    }, [])
  );

  return (
    <View style={styles_2.container}>
      <ScrollView contentContainerStyle={styles.details_container}>
        {   
          cloth.image ? (
            <View style={styles_2.image_container}>
              <Image source={{ uri: cloth.image.toString() }} style={styles.details_image} resizeMode="cover" />
            </View>
          ) : null
        }
        <View style={{width: '95%'}}>
          <ClothInfoTable {...cloth} />
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => router.push({pathname: '/(auth)/wardrobe/outfit_item_details/edit_outfit_item', params: {id: cloth.id}})}
        style={[styles_2.button, {position: 'absolute', bottom: 120, right: 10}]}>
        <Ionicons name="pencil-outline" size={23} color={Colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {setDeleteAlertVisible(true)}}
        style={[styles_2.button, {position: 'absolute', bottom: 65, right: 10}]}>
        <Ionicons name="trash-outline" size={24} color={Colors.white} />
      </TouchableOpacity>
      <CustomAlert
        visible={deleteAlertVisible}
        onClose={() => setDeleteAlertVisible(false)}
        onSubmit={() => {
          handleDeleteCloth();
          setDeleteAlertVisible(false);
        }}
        question="Are you sure you want to delete this outfit?"
      />
      <Pressable style={[styles_2.button, {position: 'absolute', bottom: 10, right: 10}]} onPress={() => router.push({pathname: '/(auth)/wardrobe/outfit_item_details/add_marketplace_item', params: {id: cloth.id}})}>
        <Ionicons name="pricetags-outline" size={20} color="white" />
      </Pressable>
    </View>
  );
    
};

const styles_2 = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#7b68ee',
  },
  image_container: {
    width: 300,
    height: 300,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  }
});

export default OutfitItemDetailsScreen;