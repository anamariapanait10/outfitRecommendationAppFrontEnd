import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export class TransparentClothingItem {
    image: string;
    category: string;

    constructor(
        image: string, category: string
        ) {
            this.image = image;
            this.category = category;
        }
};

const TransparentClothCard = ( cloth: TransparentClothingItem ) => {
    return (
        <View style={styles.card}>
            <Image source={{ uri: `${cloth.image}` }} style={cloth.category!=="Bodywear"?styles.image:styles.longImage} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'transparent',
        borderRadius: 5,
        margin: 1,
        alignItems: 'center',
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 5,
    },
    longImage: {
        height: 160,
        width: 80,
        borderRadius: 5,
    }
});

export default TransparentClothCard;