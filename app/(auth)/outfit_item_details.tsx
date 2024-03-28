import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Image } from 'react-native';
import styles from '../styles';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { ClothingItem } from './cloth_card';
import { DataStorageSingleton } from './data_storage_singleton';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import ClothInfoTable from '../../components/ClothInfoTable';

const OutfitItemDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const placeholderImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/B8AAwAB/QL8T0LgAAAABJRU5ErkJggg==";
  const [ cloth, setCloth ] = useState(new ClothingItem(0, 0, "", "", "", "", "", "", "", "", placeholderImage));
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [previousFocusState, setPreviousFocusState] = useState(false);

  const onNavigateToPage = () => {
    if(typeof id == 'string') {
      let ci = DataStorageSingleton.getInstance().clothingItems.find(i => i.id == parseInt(id));  
      if(ci) {
        setCloth(ci);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (isFocused) {
        // If gaining focus and was not previously focused, it's navigating to the page
        onNavigateToPage();
      }
      
      // Update the previous focus state
      setPreviousFocusState(isFocused);

      return () => {
        setCloth(new ClothingItem(0, 0, "", "", "", "", "", "", "", "", placeholderImage));
      };
     
    }, [isFocused])
  );

  const handleDeleteCloth = async () => {
    if (!userId || !isLoaded) {
      console.log('No authenticated user found.');
      return;
    }
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/outfit-items/${id}/`, {
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

  const handleClassify = async () => {
    if (!userId || !isLoaded) {
      console.log('No authenticated user found.');
      return;
    }
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/outfit-items/classify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          "image" : cloth.image
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete the item');
      }
  
      router.back();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.details_container}>
      {
        cloth.image ?  <Image source={{ uri: cloth.image.toString() }} style={styles.details_image} resizeMode="contain" /> : ""
      }
      {/* <View style={styles.detailsContainer}>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Color:</Text> {cloth.color}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Category:</Text> {cloth.category}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Pattern:</Text> {cloth.pattern}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Material:</Text> {cloth.material}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Season:</Text> {cloth.seasons}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Occasions:</Text> {cloth.occasions}</Text>
          {cloth.description && <Text style={styles.detailText}><Text style={styles.detailLabel}>Description:</Text> {cloth.description}</Text>}
      </View> */}
      <View style={{width: '95%'}}>
        <ClothInfoTable {...cloth} />
      </View>
      {/* <View style={styles.deleteIconContainer}>
        <Ionicons name="trash-outline" size={24} color="#eb5058" onPress={handleDeleteCloth} />
        <View>
          <Text></Text>
        </View>
        <Ionicons name="shirt" size={24} color="#7b68ee" onPress={handleClassify} />
      </View> */}
    </ScrollView>
    
  );
    
};


export default OutfitItemDetailsScreen;