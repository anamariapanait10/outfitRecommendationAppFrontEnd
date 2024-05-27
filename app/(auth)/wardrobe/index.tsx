import React, { useState } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import ClothCard, { ClothingItem } from '../../../components/cloth_card';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FilterBar from '../../../components/filter_bar';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { DataStorageSingleton } from '../../../constants/data_storage_singleton';
import { TouchableOpacity } from 'react-native-gesture-handler';

const WardrobeScreen = () => {
    const { isLoaded, userId, getToken } = useAuth();
    const [refreshing, setRefreshing] = useState(true);
    const [filteredClothes, setFilteredClothes] = useState<ClothingItem[] | undefined>();
    const [wardrobeError, setWardrobeError] = useState<string | undefined>();

    const fetchClothesData = async () => {
        setRefreshing(true);
        await DataStorageSingleton.getInstance().fetchClothesData(await getToken(), userId, isLoaded);
        let clothes = DataStorageSingleton.getInstance().clothingItems;
        setFilteredClothes(clothes);
        if (clothes.length === 0) {
            setWardrobeError("No clothing items in your wardrobe yet. Please add some.");
        } else {
            setWardrobeError(undefined);
        }

        handleFilterChange('category', DataStorageSingleton.getInstance().lastWardrobeFilter);

        setRefreshing(false);
    };

    const handleFilterChange = (filterType, value) => {
        if (value === 'All') {
            setFilteredClothes(DataStorageSingleton.getInstance().clothingItems);
        } else {
            const filtered = DataStorageSingleton.getInstance().clothingItems.filter(cloth => cloth[filterType] === value);
            setFilteredClothes(filtered);
        }
        DataStorageSingleton.getInstance().lastWardrobeFilter = value;
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
            {wardrobeError && <Text style={{marginTop: 20, backgroundColor: 'white', width: '80%', alignSelf: 'center', padding: 10, borderRadius: 10}}>{wardrobeError}</Text>}    
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
                <TouchableOpacity style={styles.button} onPress={() => router.push({pathname: '/(auth)/wardrobe/add_cloth_item'})}>
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