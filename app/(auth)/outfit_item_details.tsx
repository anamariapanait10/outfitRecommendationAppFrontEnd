import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Image } from 'react-native';
import styles from '../styles';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';

const OutfitItemDetailsScreen = () => {
  const { 
    id, 
    wardrobe_id,
    name,
    description,
    size,
    color,
    category,
    pattern,
    material,
    season,
    image 
  } = useLocalSearchParams();
  const { isLoaded, userId, sessionId, getToken } = useAuth();

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

  return (
    <ScrollView contentContainerStyle={styles.details_container}>
      <Image source={{ uri: image.toString() }} style={styles.details_image} resizeMode="contain" />
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}><Text style={styles.detailLabel}>Name:</Text> {name}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Description:</Text> {description}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Size:</Text> {size}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Color:</Text> {color}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Category:</Text> {category}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Pattern:</Text> {pattern}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Material:</Text> {material}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Season:</Text> {season}</Text>
      </View>
      <View style={styles.deleteIconContainer}>
        <Ionicons name="trash-outline" size={24} color="#eb5058" onPress={handleDeleteCloth} />
      </View>
    </ScrollView>
    
  );
    
};


export default OutfitItemDetailsScreen;