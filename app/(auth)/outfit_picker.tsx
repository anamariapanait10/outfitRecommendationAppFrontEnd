import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Dimensions, Modal } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';
import { DataStorageSingleton } from './data_storage_singleton';
import { useAuth } from '@clerk/clerk-expo';
import { ClothingItem } from './cloth_card';
import Colors from '../../constants/Colors';
import SpinnerOverlay from './spinner_overlay';
import DropDownPicker from 'react-native-dropdown-picker';

const OutfitPicker = () => {
    const { isLoaded, userId, getToken } = useAuth();
    const [topwearIndex, setTopwearIndex] = useState(0);
    const [bottomwearIndex, setBottomwearIndex] = useState(0);
    const [footwearIndex, setFootwearIndex] = useState(0);
    const [topwears, setTopwears] = useState<ClothingItem[]>([]);
    const [bottomwears, setBottomwears] = useState<ClothingItem[]>([]);
    const [footwears, setFootwears] = useState<ClothingItem[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [expertResponse, setExpertResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownValue, setDropdownValue] = useState("");
    const [dropdownItems, setDropdownItems] = useState([
      {label: 'Casual', value: 'Casual'},
      {label: 'Ethnic', value: 'Ethnic'},
      {label: 'Formal', value: 'Formal'},
      {label: 'Sports', value: 'Sports'},
      {label: 'Smart Casual', value: 'Smart Casual'},
      {label: 'Travel', value: 'Travel'},
      {label: 'Party', value: 'Party'}
    ]);
    
    const fetchClothesData = async () => {
      setLoading(true);
      await DataStorageSingleton.getInstance().fetchClothesData(await getToken(), userId, isLoaded);
      let clothes = DataStorageSingleton.getInstance().clothingItems;
      setTopwears(clothes.filter(cloth => cloth["category"] === "Topwear"));
      setBottomwears(clothes.filter(cloth => cloth["category"] === "Bottomwear"));
      setFootwears(clothes.filter(cloth => cloth["category"] === "Footwear"));
      setLoading(false);
    };
    
    useEffect(() => {
      fetchClothesData(); 
    }, []);

    const renderCarouselItem = ({ item, index }) => {
        return (
            <View style={styles.item}>
            <Image src={item.image} style={styles.image} />
            </View>
        );
    };
    const renderOutfitItem = (item) => {
      return (
        <View style={styles.outfitItem}>
          <Image source={{ uri: item?.image }} style={styles.outfitImage} />
        </View>
      );
    };

    const askAiExpert = async () => {
      setLoading(true);
      await DataStorageSingleton.getInstance().askAiExpert(topwears[topwearIndex], bottomwears[bottomwearIndex], footwears[footwearIndex], dropdownValue, await getToken(), userId, isLoaded);
      setExpertResponse(DataStorageSingleton.getInstance().lastAIExpertResponse);
      setLoading(false);
      setIsModalVisible(true);
    }

    return (
      <View style={styles.mainContainer}>
        <SpinnerOverlay isVisible={loading} />
        <GestureHandlerRootView>    
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {setIsModalVisible(false)}}
          > 
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View style={styles.modalView}>
                <Text style={{fontSize: 25}}>Expert's decision</Text>
                {renderOutfitItem(topwears[topwearIndex])}
                {renderOutfitItem(bottomwears[bottomwearIndex])}
                {renderOutfitItem(footwears[footwearIndex])}
                <Text>
                   {expertResponse.decision == 'Yes' ? 'The outfit will look great!' : 'This outfit is not be the best, maybe try another one.'}
                </Text>
                <Text>
                  {expertResponse.reason}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {setIsModalVisible(false)}}
                >
                  <Text>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
            
          </Modal>
        </GestureHandlerRootView>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '50%', marginLeft: 5}}>
            <DropDownPicker
              open={isDropdownOpen}
              value={dropdownValue}
              items={dropdownItems}
              setOpen={setDropdownOpen}
              setValue={setDropdownValue}
              setItems={setDropdownItems}
              placeholder="Select an occasion"
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>
          <TouchableOpacity style={{ backgroundColor: 'black', width: '45%', height:50, padding:15, paddingLeft: 29, borderRadius: 5, marginRight: 5}} onPress={askAiExpert}>
            <Text style={styles.buttonText}>Ask the AI Expert</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.outfitContainer}>
          <Carousel
          data={topwears}
          layout={"default"}
          renderItem={renderCarouselItem}
          sliderWidth={ Dimensions.get('window').width }
          itemWidth={ Dimensions.get('window').width - 20 }
          onSnapToItem={(index) => setTopwearIndex(index)}
          />
          <Carousel
          data={bottomwears}
          layout={"default"}
          renderItem={renderCarouselItem}
          sliderWidth={ Dimensions.get('window').width }
          itemWidth={ Dimensions.get('window').width - 20 }
          onSnapToItem={(index) => setBottomwearIndex(index)}
          />
          <Carousel
          data={footwears}
          layout={"default"}
          renderItem={renderCarouselItem}
          sliderWidth={ Dimensions.get('window').width }
          itemWidth={ Dimensions.get('window').width - 20 }
          onSnapToItem={(index) => setFootwearIndex(index)}
          />
        </View> 
        <View style={{position: 'absolute', bottom: 20, right: 20}}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Save Outfit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
      width: '100%',
      height: '100%',
      paddingTop: 5,
      flex: 1,
      flexDirection: 'column'
      // alignItems: 'center'
    },
    outfitContainer: {
      // flex: 1,
      // paddingTop: 20,
      marginTop: 5,
      marginBottom: 30,
      // alignItems: 'center'
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
      alignItems: 'center',
      justifyContent: 'center'
    },
    image: {
      width: 150,
      height: 150,
      marginBottom: 10,
      borderRadius: 12
    },
    button: {
      // marginTop: 10,
      padding: 10,
      backgroundColor: '#000',
      borderRadius: 5,
      // marginBottom: 10,
      // alignSelf: 'auto',
      // width: '45%'
    },
    buttonText: {
      color: '#fff',
    },
    modalView: {
      margin: 20,
      height: Dimensions.get('window').height - 200,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    closeButton: {
      backgroundColor: Colors.light_purple,
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginTop: 15
    },
    outfitImage: {
      width: 70,
      height: 80,
      marginRight: 2,
      alignSelf: 'center',
      // marginTop: 2,
    },
  });
  

export default OutfitPicker;
