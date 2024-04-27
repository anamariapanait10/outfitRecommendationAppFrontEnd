import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import ClothCard, { ClothingItem } from './cloth_card';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FilterBar from './filter_bar';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { DataStorageSingleton } from './data_storage_singleton';
import { TouchableOpacity } from 'react-native-gesture-handler';

const WardrobeScreen = () => {
    const { isLoaded, userId, getToken } = useAuth();
    const [refreshing, setRefreshing] = useState(true);
    const [filteredClothes, setFilteredClothes] = useState<ClothingItem[] | undefined>();

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

    // useEffect(() => {
    //     fetchClothesData(); 
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchClothesData(); 
        }, [])
    );

    return (
        <View style={{height: '100%'}}>
            <View style={{height: 80}}>
                <FilterBar onFilterChange={handleFilterChange} />
            </View>    
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
            <GestureHandlerRootView style={{ position: 'absolute', bottom: 20, right: 20 }}>      
                <TouchableOpacity style={styles.button} onPress={() => router.replace({pathname: '/(auth)/add_cloth_item'})}>
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
            </GestureHandlerRootView> 
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#7b68ee',
    },
  });

export default WardrobeScreen;