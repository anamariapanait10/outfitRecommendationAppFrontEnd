import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, FlatList, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { DataStorageSingleton } from "../../../constants/data_storage_singleton";
import { useAuth } from "@clerk/clerk-expo";
import SpinnerOverlay from "../../../components/spinner_overlay";
import { ClothingItem } from "../../../components/cloth_card";
import MarketplaceItemDetailsTable from "../../../components/MarketplaceItemDetailsTable";

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
        location: string = ''
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
    }
}

const MarketplaceItemDetails = () => {
    const { isLoaded, userId, getToken } = useAuth();
    const { id } = useLocalSearchParams();
    const [itemId, setItemId] = useState('');
    const [marketplaceItem, setMarketplaceItem] = useState<MarketplaceItem | undefined>();
    const [loading, setLoading] = useState(false);
    const [recommendationsLoading, setRecommendatiopsLoading] = useState(false);
    const [similarItems, setSimilarItems] = useState<MarketplaceItem[] | undefined>([new MarketplaceItem(), new MarketplaceItem(), new MarketplaceItem()]);

    const fetchData = async () => {
        if(typeof itemId === 'string' && itemId !== '') {
            setLoading(true);
            console.log('loading ' + itemId);
            let item = await DataStorageSingleton.getInstance().getMarketplaceItemById(itemId, await getToken(), userId, isLoaded);
            setMarketplaceItem(item);
            DataStorageSingleton.getInstance().marketPlaceItemId = item.id;
            setLoading(false);
            setRecommendatiopsLoading(true);
            let similarItems = await DataStorageSingleton.getInstance().fetchSimilarItems(itemId,  await getToken(), userId, isLoaded);
            setSimilarItems(similarItems);
            setRecommendatiopsLoading(false);
        }
    }

    useFocusEffect(React.useCallback(() => {
      if(typeof id === 'string') {
        setItemId(id);
      }
      console.log('set to ' + id);
    }, [id]));

    useEffect(() => {
        fetchData();
    }, [itemId])

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
