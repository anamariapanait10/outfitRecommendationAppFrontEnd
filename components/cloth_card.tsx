import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../app/styles';
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
    itemprobability: any;
    image: string;

    constructor(id: number = 0,
        wardrobe_id: number = 0,
        description: string = '',
        color: string = '',
        category: string = '',
        subCategory: string = '',
        pattern: string = '',
        material: string = '',
        seasons: string = '',
        occasions: string = '',
        itemprobability: any = {},
        image: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wYAAnMB+wka/dsAAAAASUVORK5CYII='
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
            this.itemprobability = itemprobability;
        }
};

const ClothCard = ( cloth: ClothingItem ) => {
    return (
        <TouchableOpacity onPress={() => {
                router.push({pathname: '/(auth)/wardrobe/outfit_item_details', params: {
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