import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles';
import { router } from 'expo-router';

export type ClothingItem = {
    id: number;
    wardrobe_id: number;
    name: string;
    description: string;
    size: string;
    color: string;
    category: string;
    pattern: string;
    material: string;
    season: string;
    image: string;
};

const ClothCard = ( cloth: ClothingItem ) => {
    return (
        <TouchableOpacity onPress={() => {
                router.replace({pathname: '/(auth)/outfit_item_details', params: {
                        id: cloth.id, 
                        wardrobe_id: cloth.wardrobe_id,
                        name: cloth.name,
                        description: cloth.description,
                        size: cloth.size,
                        color: cloth.color, 
                        category: cloth.category, 
                        pattern: cloth.pattern, 
                        material: cloth.material,
                        image: cloth.image,
                        season: cloth.season,
                    } 
                });
            }}>
            <View style={styles.card}>
                <Image source={{ uri: `${cloth.image}` }} style={styles.image} />
                <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{cloth.name}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ClothCard;