import React, { useState } from 'react';
import { View, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import styles from '../../../styles';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { ClothingItem } from '../../../../components/cloth_card';
import { DataStorageSingleton } from '../../../../constants/data_storage_singleton';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import ClothInfoTable from '../../../../components/ClothInfoTable';

const OutfitItemDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { isLoaded, userId, getToken } = useAuth();
  const placeholderImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/B8AAwAB/QL8T0LgAAAABJRU5ErkJggg==";
  const [ cloth, setCloth ] = useState(new ClothingItem(0, 0, "", "", "", "", "", "", "", "", placeholderImage));
  const isFocused = useIsFocused();

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

      return () => {
        setCloth(new ClothingItem(0, 0, "", "", "", "", "", "", "", "", placeholderImage));
      };
     
    }, [isFocused])
  );

  return (
    <View style={styles_2.container}>
      <ScrollView contentContainerStyle={styles.details_container}>
        {
          cloth.image ?  <Image source={{ uri: cloth.image.toString() }} style={styles.details_image} resizeMode="contain" /> : ""
        }
        <View style={{width: '95%'}}>
          <ClothInfoTable {...cloth} />
        </View>
      </ScrollView>
      <Pressable style={styles_2.button} onPress={() => router.push({pathname: '/(auth)/wardrobe/outfit_item_details/add_marketplace_item', params: {id: cloth.id}})}>
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
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default OutfitItemDetailsScreen;