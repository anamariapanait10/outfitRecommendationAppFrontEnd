import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';

const OutfitPicker = () => {
    const [topwearIndex, setTopwearIndex] = useState(0);
    const [bottomwearIndex, setBottomwearIndex] = useState(0);
    const [footwearIndex, setFootwearIndex] = useState(0);

    const topwear = [
        { image: require('..\\..\\assets\\images\\topwear_icon.png') },
        { image: require('..\\..\\assets\\images\\topwear_icon.png') },
    ];

    const bottomwear = [
        { image: require('..\\..\\assets\\images\\bottomwear_icon.png') },
        { image: require('..\\..\\assets\\images\\topwear_icon.png') },
    ];
    
    const footwear = [
        { image: require('..\\..\\assets\\images\\topwear_icon.png') },
        { image: require('..\\..\\assets\\images\\topwear_icon.png') },        
    ];
    
    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.item}>
            <Image source={item.image} style={styles.image} />
            </View>
        );
    };

    return (
    <View style={styles.container}>
        <Text style={styles.header}>Choose Your Outfit</Text>
        <Text style={styles.categoryLabel}>Topwear</Text>
        <Carousel
        data={topwear}
        renderItem={renderItem}
        sliderWidth={300}
        itemWidth={300}
        />
        <Text style={styles.categoryLabel}>Bottomwear</Text>
        <Carousel
        data={bottomwear}
        renderItem={renderItem}
        sliderWidth={300}
        itemWidth={300}
        />
        <Text style={styles.categoryLabel}>Footwear</Text>
        <Carousel
        data={footwear}
        renderItem={renderItem}
        sliderWidth={300}
        itemWidth={300}
        />
        <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save Outfit</Text>
        </TouchableOpacity>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      alignItems: 'center',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    categoryLabel: {
      fontSize: 18,
      marginTop: 20,
    },
    item: {
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 100,
      height: 100,
    },
    button: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#000',
      borderRadius: 5,
      marginBottom: 20,
    },
    buttonText: {
      color: '#fff',
    },
  });
  

export default OutfitPicker;
