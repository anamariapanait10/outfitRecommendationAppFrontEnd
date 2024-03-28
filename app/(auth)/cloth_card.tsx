import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles';
import { router } from 'expo-router';

export class ClothingItem {
    id: number;
    wardrobe_id: number;
    description: string;
    color: string;
    category: string;
    subCategory: string;
    pattern: string;
    material: string;
    seasons: string;
    occasions: string;
    image: string;

    constructor(id: number,
        wardrobe_id: number,
        description: string,
        size: string,
        color: string,
        category: string,
        subCategory: string,
        pattern: string,
        material: string,
        seasons: string,
        occasions: string,
        image: string
        ) {
            this.id = id;
            this.wardrobe_id = wardrobe_id;
            this.description = description;
            this.color = color;
            this.category = category;
            this.subCategory = subCategory;
            this.pattern = pattern;
            this.material = material;
            this.seasons = seasons;
            this.occasions = occasions;
            this.image = image;
        }
};

const ClothCard = ( cloth: ClothingItem ) => {
    return (
        <TouchableOpacity onPress={() => {
                router.replace({pathname: '/(auth)/outfit_item_details', params: {
                        id: cloth.id
                    } 
                });
            }}>
            <View style={styles.card}>
                <Image source={{ uri: `${cloth.image}` }} style={styles.image} />
                <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{cloth.subCategory}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ClothCard;