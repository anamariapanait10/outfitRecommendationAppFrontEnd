import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, ScrollView } from 'react-native';


const categories = [
    { name: 'All', image: require('../../assets/images/topwear_icon.png') },
    { name: 'Topwear', image: require('../../assets/images/topwear_icon.png') },
    { name: 'Bottomwear', image: require('../../assets/images/bottomwear_icon.png') },
    { name: 'Footwear', image: require('../../assets/images/topwear_icon.png') },
    { name: 'Bodywear', image: require('../../assets/images/topwear_icon.png') },
    { name: 'Accessories', image: require('../../assets/images/topwear_icon.png') },
];

const FilterBar = ({ onFilterChange }) => {
    // const categories = ['All', 'Topwear', 'Bottomwear', 'Footwear', 'Bodywear', 'Accessories'];
    return (
        <ScrollView  
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={styles.filterButton}
              onPress={() => onFilterChange('category', category.name)}
            >
              <Image source={category.image} style={styles.filterImage} />
              <Text style={styles.filterText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
  };
  
  const styles = StyleSheet.create({
    scrollViewContainer: {
        // alignItems: 'top',
        flexDirection: 'row',
        paddingTop: 10,
        // height: 50
    },
    filterButton: {
        alignItems: 'center',
        // justifyContent: 'center',
        marginHorizontal: 8,
        // marginBottom: 2,
        height: 50
    },
    filterImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    filterText: {
        marginTop: 3,
        fontSize: 12,
        color: '#333',
    },
});
  
  export default FilterBar;