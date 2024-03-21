import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles';
import { router } from 'expo-router';

export class ClothingItem {
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

    constructor(id: number,
        wardrobe_id: number,
        name: string,
        description: string,
        size: string,
        color: string,
        category: string,
        pattern: string,
        material: string,
        season: string,
        image: string
        ) {
            this.name = name;
            this.id = id;
            this.wardrobe_id = wardrobe_id;
            this.description = description;
            this.size = size;
            this.color = color;
            this.category = category;
            this.pattern = pattern;
            this.material = material;
            this.season = season;
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
                <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{cloth.name}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ClothCard;