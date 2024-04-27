import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export class TransparentClothingItem {
    image: string;

    constructor(
        image: string
        ) {
            this.image = image;
        }
};

const TransparentClothCard = ( cloth: TransparentClothingItem ) => {
    return (
        <View style={styles.card}>
            <Image source={{ uri: `${cloth.image}` }} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'transparent',
        borderRadius: 5,
        height: 70,
        // padding: 5,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15,
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 5,
    }
});

export default TransparentClothCard;