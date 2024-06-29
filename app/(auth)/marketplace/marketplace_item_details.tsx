import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, FlatList, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { DataStorageSingleton } from "../../../constants/data_storage_singleton";
import { useAuth } from "@clerk/clerk-expo";
import SpinnerOverlay from "../../../components/spinner_overlay";
import { ClothingItem } from "../../../components/cloth_card";
import MarketplaceItemDetailsTable from "../../../components/MarketplaceItemDetailsTable";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export class MarketplaceItem {
    id: number;
    userId: string;
    outfit: ClothingItem;
    description: string;
    status: string;
    images: string[];
    condition: string;
    size: string;
    brand: string;
    postedDate: string;
    price: number;
    location: string;
    username;
    phone_number: string;

    constructor(
        id: number = Math.random() * 100,
        userId: string = '',
        outfit: ClothingItem = new ClothingItem(),
        description: string = '',
        status: string = '',
        images: string[] = [],
        condition: string = '',
        size: string = '',
        brand: string = '',
        postedDate: string = '',
        price: number = 0,
        location: string = '',
        username: string = '',
        phone_number: string = ''
    ) {
        this.id = id;
        this.userId = userId;
        this.outfit = outfit;
        this.description = description;
        this.status = status;
        this.images = images;
        this.condition = condition;
        this.size = size;
        this.brand = brand;
        this.postedDate = postedDate;
        this.price = price;
        this.location = location;
        this.username = username;
        this.phone_number = phone_number;
    }
}

const MarketplaceItemDetails = () => {
    const { isLoaded, userId, getToken } = useAuth();
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const [itemId, setItemId] = useState('');
    const [marketplaceItem, setMarketplaceItem] = useState<MarketplaceItem | undefined>();
    const [loading, setLoading] = useState(false);
    const [recommendationsLoading, setRecommendationsLoading] = useState(false);
    const [similarItems, setSimilarItems] = useState<MarketplaceItem[] | undefined>([new MarketplaceItem(), new MarketplaceItem(), new MarketplaceItem()]);
    const [showDeleteButton, setShowDeleteButton] = useState(false);

    const fetchData = async () => {
        if(typeof itemId === 'string' && itemId !== '') {
            setLoading(true);
            console.log('loading ' + itemId);
            let item = await DataStorageSingleton.getInstance().getMarketplaceItemById(itemId, await getToken(), userId, isLoaded);
            setMarketplaceItem(item);
            DataStorageSingleton.getInstance().marketPlaceItemId = item.id;
            
            if (userId && item.user_id === userId) {
              setShowDeleteButton(true);
            } else {
              setShowDeleteButton(false);
            }
            setLoading(false);
            setRecommendationsLoading(true);
            let similarItems = await DataStorageSingleton.getInstance().fetchSimilarItems(itemId,  await getToken(), userId, isLoaded);
            setSimilarItems(similarItems);
            setRecommendationsLoading(false);
        }
    }

    const handleDeleteMarketplaceItem = async () => {
      if (!userId || !isLoaded) {
        console.log('No authenticated user found.');
        return;
      }
      try {
        const token = await getToken();
        const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/marketplace-items/${DataStorageSingleton.getInstance().marketPlaceItemId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to delete the marketplace item');
        }
    
        router.back();
      } catch (error) {
        console.error(error);
      }
    };

    useFocusEffect(React.useCallback(() => {
      if(typeof id === 'string') {
        setItemId(id);
      }
      console.log('set to ' + id);
    }, [id]));

    useEffect(() => {
        fetchData();
    }, [itemId])

    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <>
            {showDeleteButton ?
            <TouchableOpacity
              onPress={handleDeleteMarketplaceItem}
              style={{
                marginRight: 10,
                paddingLeft: 4,
                paddingRight: 4,
                paddingTop: 3,
                paddingBottom: 3,
                borderColor: '#fff',
                borderWidth: 1,
                borderRadius: 15,
                backgroundColor: '#fff',  
              }}>
              <Ionicons name="trash-outline" size={24} color={'black'} />
            </TouchableOpacity> : null}
          </>
        ),
      });
    }, [navigation, showDeleteButton]);

    return (
        <ScrollView>
          <SpinnerOverlay isVisible={loading} />
          <View style={styles.containerPadding}>
            <Image style={styles.image} source={{ uri: marketplaceItem?.outfit.image }} />
            {/* <Text style={styles.detail}>Brand: {item?.brand}</Text>
            <Text style={styles.detail}>Size: {item?.size}</Text>
            <Text style={styles.detail}>Condition: {item?.condition}</Text>
            <Text style={styles.detail}>Price: ${item?.price}</Text>
            <Text style={styles.detail}>Location: {item?.location}</Text>
            <Text style={styles.detail}>Posted Date: {item?.postedDate}</Text>
            <Text style={styles.title}>{item?.description}</Text> */}

            <Text style={styles.title}>{marketplaceItem?.description}</Text>  
            <View style={{width: '95%'}}>
              <MarketplaceItemDetailsTable {...marketplaceItem} />
            </View>
            {/* <Button onPress={() => console.log(marketplaceItem?.phone_number)}>View seller phone number</Button> */}
          </View>
          <FlatList horizontal
            id="recommendedItemsList"
            data={similarItems}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.contentContainer}
            style={{marginBottom: 10}}
            renderItem={({ item: recommendedItem }) => (
              <TouchableOpacity style={styles.card} onPress={() => {setItemId(recommendedItem.id.toString()); router.setParams({id: recommendedItem.id.toString()})}}>
                <View>
                  <Text style={styles.brand}>{recommendedItem.brand}</Text>
                  <Text style={styles.price}>${recommendedItem.price}</Text>
                </View>
                <Image source={{ uri: recommendedItem?.outfit.image }} style={styles.recommendedImage}></Image>
                {recommendationsLoading && (
                  <View style={styles.overlay}>
                    <ActivityIndicator size="small" color="purple" />
                  </View>
                )}
              </TouchableOpacity>
          )}/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  containerPadding: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    // fontSize: 20,
    // fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 20,
  },
  recommendedImage: {
    height: 50,
    width: 50,
    justifyContent: 'space-between',
    borderRadius: 15
  },
  detail: {
    fontSize: 16,
    marginTop: 5,
  },
  contentContainer: {
    paddingHorizontal: 10
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    width: Dimensions.get('window').width * 0.5, // Adjust the width of the card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: 16,
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(190,190,190,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
});

export default MarketplaceItemDetails;
