import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, Alert, RefreshControl, Pressable, StyleSheet } from 'react-native';
import ClothCard from './cloth_card';
import { ClothingItem } from './cloth_card';
// import FilterBar from './filter_bar';

import { router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

const WardrobeScreen = () => {
    const clothingItems: ClothingItem[] = [];
    const [clothes, setClothes] = useState(clothingItems);

    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [refreshing, setRefreshing] = useState(true);
    // const [filteredClothes, setFilteredClothes] = useState(clothes);

    const fetchClothesData = async () => {
        if (!userId || !isLoaded) {
            console.log('No authenticated user found.');
            return;
        }
        try {
            const token = await getToken();
            setRefreshing(true);
            const response = await fetch(process.env.EXPO_PUBLIC_BASE_API_URL + '/outfit-items/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setRefreshing(false);
            // console.log(data);
            setClothes(data); // Update the state with the fetched data
            //     setFilteredClothes(clothes);
        } catch (error: any) {
            // Handle any errors, such as by displaying an alert
            Alert.alert("Error fetching data", error.message);
        }
    };

    useEffect(() => {
        fetchClothesData(); // Call the function to fetch data
    }, []);

    // const handleFilterChange = (filterType, value) => {
    //     const filtered = clothes.filter(cloth => cloth[filterType] === value);
    //     setFilteredClothes(filtered);
    // };

    return (
        <View style={styles.container}>
            {/* <FilterBar onFilterChange={handleFilterChange} /> */}
            <FlatList
                style={{ width: '100%' }}
                data={clothes}
                renderItem={({ item }) => <ClothCard {...item} />}
                keyExtractor={item => item.id.toString()}
                numColumns={3}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchClothesData} />
                }
            />
            {/* <Button
                onPress={() => router.replace({pathname: '/(auth)/add_item_page'})}
                title="Add cloth item"
                color="#7b68ee"
            /> */}
            <Pressable style={styles.button} onPress={() => router.replace({pathname: '/(auth)/add_item_page'})}>
                <Ionicons name="add" size={24} color="white" />
            </Pressable>         
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#7b68ee',
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
  });

export default WardrobeScreen;