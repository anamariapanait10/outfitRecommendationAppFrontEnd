import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, Alert, RefreshControl, Pressable, StyleSheet } from 'react-native';
import ClothCard, { ClothingItem } from './cloth_card';

import FilterBar from './filter_bar';

import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { DataStorageSingleton } from './data_storage_singleton';
import { useIsFocused } from '@react-navigation/native';

const WardrobeScreen = () => {
    
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [refreshing, setRefreshing] = useState(true);
    const [filteredClothes, setFilteredClothes] = useState<ClothingItem[] | undefined>();
    const isFocused = useIsFocused();
    const [previousFocusState, setPreviousFocusState] = useState(false);

    const fetchClothesData = async () => {
        setRefreshing(true);
        await DataStorageSingleton.getInstance().fetchClothesData(await getToken(), userId, isLoaded);
        setFilteredClothes(DataStorageSingleton.getInstance().clothingItems);

        setRefreshing(false);
    };

    const handleFilterChange = (filterType, value) => {
        if (value === 'All') {
            setFilteredClothes(DataStorageSingleton.getInstance().clothingItems);
        } else {
            const filtered = DataStorageSingleton.getInstance().clothingItems.filter(cloth => cloth[filterType] === value);
            setFilteredClothes(filtered);
        }
    };

    useEffect(() => {
        fetchClothesData(); 
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchClothesData(); 
        }, [])
    );

    // const handleFilterChange = (filterType, value) => {
    //     const filtered = clothes.filter(cloth => cloth[filterType] === value);
    //     setFilteredClothes(filtered);
    // };

    return (
        <View style={styles.container}>
            <FilterBar onFilterChange={handleFilterChange} />
            <FlatList
                style={{ width: '100%'}}
                data={filteredClothes}
                renderItem={({ item }) => <ClothCard {...item} />}
                keyExtractor={item => item.id.toString()}
                numColumns={3}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchClothesData} />
                }
            />
            {/* <Pressable style={styles.button} onPress={() => router.replace({pathname: '/(auth)/add_item_page'})}>
                <Ionicons name="add" size={24} color="white" />
            </Pressable> */}
            <Pressable style={styles.button} onPress={() => router.replace({pathname: '/(auth)/add_cloth_item'})}>
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